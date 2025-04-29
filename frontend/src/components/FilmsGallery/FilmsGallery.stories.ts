import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FilmsGallery } from './FilmsGallery';
import {CDN_URL} from "../../utils/constants.ts";

const meta = {
  title: 'UI/FilmsGallery',
  component: FilmsGallery,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn()
  },
} satisfies Meta<typeof FilmsGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        "id": "1",
        "title": "Архитекторы общества",
        "image": `${CDN_URL}/bg1s.jpg`
      },
      {
        "id": "2",
        "title": "Недостижимая утопия",
        "image": `${CDN_URL}/bg3s.jpg`
      },
      {
        "id": "3",
        "title": "Звёздное путешествие",
        "image": `${CDN_URL}/bg5s.jpg`
      },
      {
        "id": "4",
        "title": "Стражи Гримуара",
        "image": `${CDN_URL}/bg2s.jpg`
      },
      {
        "id": "5",
        "title": "Парадокс Нексуса",
        "image": `${CDN_URL}/bg4s.jpg`
      },
      {
        "id": "6",
        "title": "Сон в летний день",
        "image": `${CDN_URL}/bg6s.jpg`
      }
    ],
    selected: "2"
  },
};