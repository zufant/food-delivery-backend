import { Controller, Get, Param } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles(); 
  }

  @Get(':id')
  async getRoleById(@Param('id') id: number): Promise<Role> {
    return this.roleService.getRoleById(id); 
  }

  @Get('name/:roleName')
  async getRoleByName(@Param('roleName') roleName: string): Promise<Role> {
    return this.roleService.getRoleByName(roleName); 
  }
}
