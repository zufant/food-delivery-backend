import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async getRoleById(roleId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { role_id: roleId } });
    
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    return role;
  }

  async getRoleByName(roleName: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    return role;
  }
}
