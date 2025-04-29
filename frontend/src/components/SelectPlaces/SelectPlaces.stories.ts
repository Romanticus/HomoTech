import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SelectPlaces } from './SelectPlaces';

const meta = {
  title: 'UI/SelectPlaces',
  component: SelectPlaces,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof SelectPlaces>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hall: {
      rows: 3,
      seats: 5
    },
    taken: ['1:1', '3:3'],
    selected: [
      { row: 2, seat: 4 },
      { row: 2, seat: 5 },
    ]
  },
};

