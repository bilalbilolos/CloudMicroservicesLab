package fr.ensimag.store.service.mapper;

import fr.ensimag.store.domain.*;
import fr.ensimag.store.service.dto.ShipmentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Shipment} and its DTO {@link ShipmentDTO}.
 */
@Mapper(componentModel = "spring", uses = { InvoiceMapper.class })
public interface ShipmentMapper extends EntityMapper<ShipmentDTO, Shipment> {
    @Mapping(target = "invoice", source = "invoice", qualifiedByName = "id")
    ShipmentDTO toDto(Shipment s);
}
