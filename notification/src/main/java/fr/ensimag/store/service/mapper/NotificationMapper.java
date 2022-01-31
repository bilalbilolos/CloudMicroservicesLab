package fr.ensimag.store.service.mapper;

import fr.ensimag.store.domain.*;
import fr.ensimag.store.service.dto.NotificationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Notification} and its DTO {@link NotificationDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {}
