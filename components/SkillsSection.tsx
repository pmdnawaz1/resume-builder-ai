'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillsErrors } from '@/types/errorTypes';
import { ResumeData } from '@/types';

interface Skill {
  category: string;
  items: string[];
}

export default function SkillsSection() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<ResumeData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills</h2>
        <button
          type="button"
          onClick={() =>
            append({
              category: '',
              items: [''],
            })
          }
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Skill Category
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
              <div className="flex-1">
                <label className="block text-sm font-medium">Category</label>
                <input
                  {...register(`skills.${index}.category`)}
                  className="input-field w-full"
                  placeholder="Programming Languages"
                />
                {(errors.skills?.[index] as SkillsErrors)?.category && (
                  <p className="text-red-500 text-sm">
                    {(errors.skills?.[index] as SkillsErrors)?.category?.message}
                  </p>
                )}
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-600 p-1 ml-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Skills</label>
              {(field as unknown as Skill).items.map((_, itemIndex) => (
                <div key={itemIndex} className="flex gap-2">
                  <input
                    {...register(`skills.${index}.items.${itemIndex}`)}
                    className="input-field flex-1"
                    placeholder="Python, JavaScript, etc."
                  />
                  {(field as unknown as Skill).items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const items = [...(field as unknown as Skill).items];
                        items.splice(itemIndex, 1);
                        const newField = {
                          ...field,
                          items,
                        };
                        remove(index);
                        append(newField);
                      }}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const items = [...(field as unknown as Skill).items, ''];
                  const newField = {
                    ...field,
                    items,
                  };
                  remove(index);
                  append(newField);
                }}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}