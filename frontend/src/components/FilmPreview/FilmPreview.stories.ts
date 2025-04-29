import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FilmPreview } from './FilmPreview';
import {CDN_URL} from "../../utils/constants.ts";

const meta = {
  title: 'UI/FilmPreview',
  component: FilmPreview,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof FilmPreview>;

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
    cover: `${CDN_URL}/bg1c.jpg`
  },
};
