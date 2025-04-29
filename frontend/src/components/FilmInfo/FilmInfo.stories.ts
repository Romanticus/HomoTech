import type { Meta, StoryObj } from '@storybook/react';
import { FilmInfo } from './FilmInfo';

const meta = {
  title: 'UI/FilmInfo',
  component: FilmInfo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FilmInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id:"821802ac-332d-4e65-acd4-5f6ef14f5880",
    rating: '2.9',
    director: 'Итан Райт',
    tags: ['Документальный'],
    title: 'Архитекторы общества',
    description: 'Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.',
  },
};

export const Compact: Story = {
  args: {
    id:"821802ac-332d-4e65-acd4-5f6ef14f5880",
    rating: '2.9',
    director: 'Итан Райт',
    tags: ['Документальный'],
    title: 'Архитекторы общества',
    description: 'Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.',
    isCompact: true,
  },
};
