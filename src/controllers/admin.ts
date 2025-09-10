import { FastifyRequest, FastifyReply } from 'fastify';
import { Admin } from '../models/adminSchema';
import cloudinary from '../libs/cloudinary';
import { AdminData, ApiResponse, IdParams } from '../types';

// Extend FastifyRequest for multipart
interface MultipartRequest extends FastifyRequest {
  file(): Promise<{
    filename: string;
    mimetype: string;
    toBuffer(): Promise<Buffer>;
  } | undefined>;
}

interface UpdateAdminBody {
  firstname: string;
  lastname: string;
  middlename?: string;
  email: string;
}

export const getAdminData = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Get admin ID from the decoded token (set by auth middleware)
    if (!request.admin?.id) {
      return reply.status(401).send({
        success: false,
        message: 'Unauthorized access'
      } as ApiResponse);
    }

    const admin = await Admin.findById(request.admin.id).select('-password');
    if (!admin) {
      return reply.status(404).send({
        success: false,
        message: 'Admin not found'
      } as ApiResponse);
    }

    const adminData: AdminData = {
      id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      middlename: admin.middlename,
      email: admin.email,
      picture: admin.picture,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };

    reply.status(200).send({
      success: true,
      message: 'Admin data retrieved successfully',
      data: { admin: adminData }
    } as ApiResponse<{ admin: AdminData }>);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const updateAdminData = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { firstname, lastname, middlename, email } = request.body as UpdateAdminBody;
    const { id } = request.params as IdParams;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { firstname, lastname, middlename, email },
      { new: true, select: '-password' }
    );

    if (!updatedAdmin) {
      return reply.status(404).send({
        success: false,
        message: 'Admin not found'
      } as ApiResponse);
    }

    const adminData: AdminData = {
      id: updatedAdmin.id,
      firstname: updatedAdmin.firstname,
      lastname: updatedAdmin.lastname,
      middlename: updatedAdmin.middlename,
      email: updatedAdmin.email,
      picture: updatedAdmin.picture,
      createdAt: updatedAdmin.createdAt,
      updatedAt: updatedAdmin.updatedAt,
    };

    reply.status(200).send({
      success: true,
      message: 'Admin data updated successfully',
      data: adminData
    } as ApiResponse<AdminData>);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const changeProfilePicture = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params as IdParams;
    
    // Handle file upload using Fastify multipart
    const data = await (request as any).file();
    
    if (!data) {
      return reply.status(400).send({
        success: false,
        message: 'No file uploaded'
      } as ApiResponse);
    }

    // Convert stream to buffer
    const buffer = await data.toBuffer();

    // Upload file buffer to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'admin_pictures' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { picture: result.secure_url },
      { new: true, select: '-password' }
    );

    if (!updatedAdmin) {
      return reply.status(404).send({
        success: false,
        message: 'Admin not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        picture: result.secure_url,
        admin: {
          id: updatedAdmin.id,
          firstname: updatedAdmin.firstname,
          lastname: updatedAdmin.lastname,
          middlename: updatedAdmin.middlename,
          email: updatedAdmin.email,
          picture: updatedAdmin.picture,
          createdAt: updatedAdmin.createdAt,
          updatedAt: updatedAdmin.updatedAt,
        }
      }
    } as ApiResponse<{ picture: string; admin: AdminData }>);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
