package com.mh.dte.config;

import com.mh.dte.entity.User;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UserRoleConverter implements AttributeConverter<User.UserRole, String> {

    @Override
    public String convertToDatabaseColumn(User.UserRole userRole) {
        if (userRole == null) {
            return null;
        }
        return userRole.name();
    }

    @Override
    public User.UserRole convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return User.UserRole.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Unknown database value for UserRole: " + dbData, e);
        }
    }
}