import { UsuarioResponseDto } from "../dtos/UsuarioDto";
import { Usuario } from "../entities/Usuario";

export class UsuarioMapper {
  //metodo para mapear una entidad a un DTO
  static toResponseDto(entity: Usuario): UsuarioResponseDto {
    return {
      id: entity.id,
      username: entity.username,
      role: entity.role,
      //password: entity.password, //no se incluye la contraseña en el DTO de respuesta por seguridad
      estado: entity.estado,
    };
  }

  //metodo para mapear una lista de entidades a una lista de DTOs
  static toResponseDtoList(entities: Usuario[]): UsuarioResponseDto[] {
    //usar el metodo toResponseDto para cada entidad
    return entities.map(this.toResponseDto);
  }
}
