import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Room } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';
import { EncryptionUtil } from '../utils/encryption.util';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';
import { IRoomRepository, IRoomService } from './room.interface';

@Injectable()
export class RoomsService implements IRoomService {
  constructor(
    @Inject('IRoomRepository')
    private roomRepository: IRoomRepository,
    @Inject(forwardRef(() => 'IRoomSessionService'))
    private roomSessionService: any,
  ) {}

  async findByRoomCode(roomCode: string): Promise<Room | null> {
    try {
      return await this.roomRepository.findByRoomCode(roomCode);
    } catch (error) {
      console.error(`Error finding room with code ${roomCode}:`, error);
      throw error;
    }
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const hashedPassword = await bcrypt.hash(createRoomDto.password, 13);
      createRoomDto.password = hashedPassword;
      return await this.roomRepository.create(createRoomDto);
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async findAll(query?: Record<string, any>): Promise<Room[]> {
    try {
      return await this.roomRepository.findAll(query || {});
    } catch (error) {
      console.error('Error finding all rooms:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Room> {
    try {
      const room = await this.roomRepository.findOne(id);
      if (!room) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }
      return room;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error finding room with id ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    try {
      if (updateRoomDto.password) {
        updateRoomDto.password = await bcrypt.hash(updateRoomDto.password, 13);
      }
      return await this.roomRepository.update(id, updateRoomDto);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.roomRepository.remove(id);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }
      throw error;
    }
  }

  async validateRoomForLogin(roomCode: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }> {
    const room = await this.findByRoomCode(roomCode);
    if (!room) {
      throw new UnauthorizedException('Invalid room code');
    }

    // Check if room has an active session
    const activeSession = await this.roomSessionService.getActiveSessionByRoomId(room.id);

    if (activeSession) {
      const { password: _, ...result } = room;
      return { room: result, status: 'active' };
    }

    // Check if session is paused
    const sessions = await this.roomSessionService.findByRoomId(room.id);
    const pausedSession = sessions.find((s: any) => s.status === 'paused');

    if (pausedSession) {
      throw new UnauthorizedException('Session is paused by admin. Please contact administrator.');
    }

    // No active session, create a pending session request
    await this.roomSessionService.requestSession(roomCode);
    const { password: _, ...result } = room;
    return { room: result, status: 'pending', message: 'Session request created. Waiting for admin approval.' };
  }

  async generateRoomQRCode(roomId: string, password: string): Promise<{ token: string; qrCode: string }> {
    try {
      // Create encrypted token with roomId and password
      const tokenData = JSON.stringify({
        roomId: roomId,
        password: password,
        timestamp: Date.now(),
      });

      const encryptedToken = EncryptionUtil.encrypt(tokenData);

      // Generate QR code
      const qrCode = await QRCode.toDataURL(encryptedToken, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1,
      });

      return {
        token: encryptedToken,
        qrCode,
      };
    } catch (error) {
      console.error('Error generating room QR code:', error);
      throw error;
    }
  }

  async validateRoomWithToken(token: string): Promise<{ room: Omit<Room, 'password'>; status: string; message?: string }> {
    try {
      // Decrypt token
      const decryptedData = EncryptionUtil.decrypt(token);
      const { roomId, password, timestamp } = JSON.parse(decryptedData);

      // Check if token is not too old (optional: 24 hours expiry)
      const tokenAge = Date.now() - timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (tokenAge > maxAge) {
        throw new UnauthorizedException('Token has expired');
      }

      // Get room
      const room = await this.roomRepository.findByRoomCode(roomId);
      if (!room) {
        throw new UnauthorizedException('Invalid room credentials');
      }

      // Verify password
      const isPasswordValid = bcrypt.compareSync(password, room.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid room credentials');
      }

      // Check if room has an active session
      const activeSession = await this.roomSessionService.getActiveSessionByRoomId(room.id);

      if (activeSession) {
        const { password: _, ...result } = room;
        return { room: result, status: 'active' };
      }

      // Check if session is paused
      const sessions = await this.roomSessionService.findByRoomId(room.id);
      const pausedSession = sessions.find((s: any) => s.status === 'paused');

      if (pausedSession) {
        throw new UnauthorizedException('Session is paused by admin. Please contact administrator.');
      }

      // No active session, create a pending session request
      await this.roomSessionService.requestSession(room.roomCode);
      const { password: _, ...result } = room;
      return { room: result, status: 'pending', message: 'Session request created. Waiting for admin approval.' };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error validating room with token:', error);
      throw new UnauthorizedException('Invalid or corrupted token');
    }
  }
}
