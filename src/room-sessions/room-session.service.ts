import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoomSession } from '@prisma/client';
import { IRoomService } from '../rooms/room.interface';
import { IRoomSessionRepository, IRoomSessionService } from './room-session.interface';

@Injectable()
export class RoomSessionService implements IRoomSessionService {
  constructor(
    @Inject('IRoomSessionRepository')
    private roomSessionRepository: IRoomSessionRepository,
    @Inject(forwardRef(() => 'IRoomService'))
    private roomService: IRoomService,
  ) {}

  async findAll(query?: Record<string, any>): Promise<RoomSession[]> {
    try {
      return await this.roomSessionRepository.findAll(query || {});
    } catch (error) {
      console.error('Error finding all room sessions:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<RoomSession> {
    try {
      const session = await this.roomSessionRepository.findOne(id);
      if (!session) {
        throw new NotFoundException(`Room session with ID ${id} not found`);
      }
      return session;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error finding room session with id ${id}:`, error);
      throw error;
    }
  }

  async findByRoomId(roomId: string): Promise<RoomSession[]> {
    try {
      return await this.roomSessionRepository.findByRoomId(roomId);
    } catch (error) {
      console.error(`Error finding sessions for room ${roomId}:`, error);
      throw error;
    }
  }

  async requestSession(roomCode: string): Promise<RoomSession> {
    try {
      const room = await this.roomService.findByRoomCode(roomCode);
      if (!room) {
        throw new NotFoundException(`Room with code ${roomCode} not found`);
      }

      // Check if there's already a pending session
      const sessions = await this.roomSessionRepository.findByRoomId(room.id);
      const pendingSession = sessions.find(s => s.status === 'pending');

      if (pendingSession) {
        return pendingSession;
      }

      // Create a new pending session with createdBy and hotelId
      const session = await this.roomSessionRepository.create({
        roomId: room.id,
        hotelId: room.hotelId,
        createdBy: room.id,
        status: 'pending',
      });

      return session;
    } catch (error) {
      console.error(`Error requesting session for room code ${roomCode}:`, error);
      throw error;
    }
  }

  async startSession(sessionId: string, adminId: string): Promise<RoomSession> {
    try {
      const session = await this.findOne(sessionId);

      if (session.status !== 'pending') {
        throw new BadRequestException(`Session is not pending. Current status: ${session.status}`);
      }

      // End any other active sessions for this room
      const roomSessions = await this.roomSessionRepository.findByRoomId(session.roomId);
      const activeSessions = roomSessions.filter(s => s.status === 'active');
      
      for (const activeSession of activeSessions) {
        await this.roomSessionRepository.update(activeSession.id, {
          status: 'ended',
          endedAt: new Date(),
        });
      }

      // Start the session
      return await this.roomSessionRepository.update(sessionId, {
        status: 'active',
        acceptedBy: adminId,
        startedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error starting session with id ${sessionId}:`, error);
      throw error;
    }
  }

  async pauseSession(sessionId: string, adminId: string): Promise<RoomSession> {
    try {
      const session = await this.findOne(sessionId);

      if (session.status !== 'active') {
        throw new BadRequestException(`Can only pause active sessions. Current status: ${session.status}`);
      }

      return await this.roomSessionRepository.update(sessionId, {
        status: 'paused',
        pausedAt: new Date(),
        pausedBy: adminId,
      });
    } catch (error) {
      console.error(`Error pausing session with id ${sessionId}:`, error);
      throw error;
    }
  }

  async resumeSession(sessionId: string, adminId: string): Promise<RoomSession> {
    try {
      const session = await this.findOne(sessionId);

      if (session.status !== 'paused') {
        throw new BadRequestException(`Can only resume paused sessions. Current status: ${session.status}`);
      }

      return await this.roomSessionRepository.update(sessionId, {
        status: 'active',
        resumedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error resuming session with id ${sessionId}:`, error);
      throw error;
    }
  }

  async endSession(sessionId: string, adminId: string): Promise<RoomSession> {
    try {
      const session = await this.findOne(sessionId);

      if (session.status === 'ended') {
        throw new BadRequestException(`Session is already ended`);
      }

      return await this.roomSessionRepository.update(sessionId, {
        status: 'ended',
        endedAt: new Date(),
        endedBy: adminId,
      });
    } catch (error) {
      console.error(`Error ending session with id ${sessionId}:`, error);
      throw error;
    }
  }

  async deleteSession(sessionId: string): Promise<RoomSession> {
    try {
      const session = await this.findOne(sessionId);
      
      if (!session) {
        throw new NotFoundException(`Room session with ID ${sessionId} not found`);
      }

      return await this.roomSessionRepository.delete(sessionId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error deleting session with id ${sessionId}:`, error);
      throw error;
    }
  }

  async getPendingSessions(query?: Record<string, any>): Promise<RoomSession[]> {
    try {
      return await this.roomSessionRepository.findAll({
        ...query,
        status: 'pending',
      });
    } catch (error) {
      console.error('Error finding pending sessions:', error);
      throw error;
    }
  }

  async getActiveSessions(query?: Record<string, any>): Promise<RoomSession[]> {
    try {
      return await this.roomSessionRepository.findAll({
        ...query,
        status: 'active',
      });
    } catch (error) {
      console.error('Error finding active sessions:', error);
      throw error;
    }
  }

  async getPausedSessions(query?: Record<string, any>): Promise<RoomSession[]> {
    try {
      return await this.roomSessionRepository.findAll({
        ...query,
        status: 'paused',
      });
    } catch (error) {
      console.error('Error finding paused sessions:', error);
      throw error;
    }
  }

  async getActiveSessionByRoomId(roomId: string): Promise<RoomSession | null> {
    try {
      const sessions = await this.roomSessionRepository.findByRoomId(roomId);
      return sessions.find(s => s.status === 'active') || null;
    } catch (error) {
      console.error(`Error finding active session for room ${roomId}:`, error);
      throw error;
    }
  }
}
