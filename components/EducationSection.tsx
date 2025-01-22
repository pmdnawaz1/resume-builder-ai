'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function EducationSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: 'education',
  });

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education</h2>
        <button
          type="button"
          onClick={() =>
            append({
              degree: '',
              school: '',
              graduationDate: '',
              gpa: '',
            })
          }
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="card p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Education {index + 1}</h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Degree</label>
                <input
                  {...register(`education.${index}.degree`)}
                  className="input-field"
                  placeholder="Bachelor of Science in Computer Science"
                />
                {errors.education?.[index]?.degree && (
                  <p className="text-red-500 text-sm">
                    {errors.education[index]?.degree?.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">School</label>
                <input
                  {...register(`education.${index}.school`)}
                  className="input-field"
                  placeholder="University Name"
                />
                {errors.education?.[index]?.school && (
                  <p className="text-red-500 text-sm">
                    {errors.education[index]?.school?.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Graduation Date
                </label>
                <input
                  {...register(`education.${index}.graduationDate`)}
                  type="month"
                  className="input-field"
                />
                {errors.education?.[index]?.graduationDate && (
                  <p className="text-red-500 text-sm">
                    {errors.education[index]?.graduationDate?.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">GPA (Optional)</label>
                <input
                  {...register(`education.${index}.gpa`)}
                  className="input-field"
                  placeholder="3.8"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                />
                {errors.education?.[index]?.gpa && (
                  <p className="text-red-500 text-sm">
                    {errors.education[index]?.gpa?.message as string}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}
