import { ClienteResponseDto } from "../dtos/ClienteDto";
import { Clientes } from "../entities/Clientes";

// Clase para mapear entre la entidad Clientes y el DTO ClienteResponseDto
export class ClienteMapper {
  // Método para mapear una entidad a un DTO
  static toResponseDto(entity: Clientes): ClienteResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      apellido1: entity.apellido1,
      apellido2: entity.apellido2,
      email: entity.email,
      telefono: entity.telefono || undefined,
    };
  }

  // Método para mapear una lista de entidades a una lista de DTOs
  static toResponseDtoList(entities: Clientes[]): ClienteResponseDto[] {
    // Usar el método toResponseDto para cada entidad
    return entities.map(this.toResponseDto);
  }
}
