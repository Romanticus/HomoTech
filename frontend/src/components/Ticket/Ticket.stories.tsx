import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Ticket } from './Ticket';

const meta = {
  title: 'UI/Ticket',
  component: Ticket,
  parameters: {
    layout: 'centered',
  },
  args: {
    onDelete: fn(),
  },
} satisfies Meta<typeof Ticket>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    place: 'A1',
    session: '10:00',
    price: '1000 ₽',
  },
};
