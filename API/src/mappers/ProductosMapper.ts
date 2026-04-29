import { ProductoResponseDto } from "../dtos/ProductoDto";
import { Productos } from "../entities/Productos";

// Clase para mapear entre la entidad Productos y el DTO ProductoResponseDto
export class ProductoMapper {
  // Método para mapear una entidad a un DTO
  static toResponseDto(entity: Productos): ProductoResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      precio: Number(entity.precio), // Convertir a número (por si es Decimal)
      stock: entity.stock,
    };
  }

  // Método para mapear una lista de entidades a una lista de DTOs
  static toResponseDtoList(entities: Productos[]): ProductoResponseDto[] {
    // Usar el método toResponseDto para cada entidad
    return entities.map(this.toResponseDto);
  }
}
