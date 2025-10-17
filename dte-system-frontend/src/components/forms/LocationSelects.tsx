// src/components/forms/LocationSelects.tsx
import React, { useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { DEPARTAMENTOS_MUNICIPIOS } from '@/utils/constants';
import type { DteDocument } from '@/types/dte.types';

interface LocationSelectsProps {
  register: UseFormRegister<DteDocument>;
  watch: UseFormWatch<DteDocument>;
  setValue: UseFormSetValue<DteDocument>;
  errors: FieldErrors<DteDocument>;
}

export const LocationSelects: React.FC<LocationSelectsProps> = ({
  register,
  watch,
  setValue,
  errors
}) => {
  const selectedDepartment = watch('receiver.department');

  useEffect(() => {
    setValue('receiver.municipality', '');
  }, [selectedDepartment, setValue]);

  const departmentOptions = Object.entries(DEPARTAMENTOS_MUNICIPIOS).map(
    ([code, data]) => ({
      value: code,
      label: data.nombre
    })
  );

  const municipalityOptions = selectedDepartment && DEPARTAMENTOS_MUNICIPIOS[selectedDepartment as keyof typeof DEPARTAMENTOS_MUNICIPIOS]
    ? Object.entries(DEPARTAMENTOS_MUNICIPIOS[selectedDepartment as keyof typeof DEPARTAMENTOS_MUNICIPIOS]?.municipios || {}).map(
        ([code, name]) => ({
          value: code,
          label: String(name)
        })
      )
    : [];

  return (
    <>
      <div className="form-group">
        <label>Departamento</label>
        <select
          {...register('receiver.department')}
          className="form-input"
          required
        >
          <option value="">Elija una opción</option>
          {departmentOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.receiver?.department && (
          <span style={{ color: '#dc2626', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            {errors.receiver.department.message}
          </span>
        )}
      </div>
      
      <div className="form-group">
        <label>Municipio</label>
        <select
          {...register('receiver.municipality')}
          className="form-input"
          required
          disabled={!selectedDepartment}
        >
          <option value="">Elija una opción</option>
          {municipalityOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.receiver?.municipality && (
          <span style={{ color: '#dc2626', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            {errors.receiver.municipality.message}
          </span>
        )}
      </div>
    </>
  );
};