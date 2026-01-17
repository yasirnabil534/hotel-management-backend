import { RoomSession } from '@prisma/client';

export interface IRoomSessionRepository {
  findAll(query: Record<string, any>): Promise<RoomSession[]>;
  findOne(id: string): Promise<RoomSession | null>;
  findByRoomId(roomId: string): Promise<RoomSession[]>;
  create(data: { roomId: string; hotelId?: string; createdBy?: string; status?: string }): Promise<RoomSession>;
  update(id: string, data: any): Promise<RoomSession>;
  updateMany(where: any, data: any): Promise<void>;
  delete(id: string): Promise<RoomSession>;
}

export interface IRoomSessionService {
  findAll(query?: Record<string, any>): Promise<RoomSession[]>;
  findOne(id: string): Promise<RoomSession | null>;
  findByRoomId(roomId: string): Promise<RoomSession[]>;
  requestSession(roomCode: string): Promise<RoomSession>;
  startSession(sessionId: string, adminId: string): Promise<RoomSession>;
  pauseSession(sessionId: string, adminId: string): Promise<RoomSession>;
  resumeSession(sessionId: string, adminId: string): Promise<RoomSession>;
  endSession(sessionId: string, adminId: string): Promise<RoomSession>;
  deleteSession(sessionId: string): Promise<RoomSession>;
  getPendingSessions(query?: Record<string, any>): Promise<RoomSession[]>;
  getActiveSessions(query?: Record<string, any>): Promise<RoomSession[]>;
  getPausedSessions(query?: Record<string, any>): Promise<RoomSession[]>;
  getActiveSessionByRoomId(roomId: string): Promise<RoomSession | null>;
}
