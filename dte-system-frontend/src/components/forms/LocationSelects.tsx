import React, { useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Select } from '@/components/ui/Select';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        {...register('receiver.department')}
        label="Departamento"
        options={departmentOptions}
        required
        error={errors.receiver?.department?.message}
      />
      <Select
        {...register('receiver.municipality')}
        label="Municipio"
        options={municipalityOptions}
        required
        disabled={!selectedDepartment}
        error={errors.receiver?.municipality?.message}
      />
    </div>
  );
};