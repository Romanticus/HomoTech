import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ContactsForm } from './ContactsForm';
import {useState} from "react";

const meta = {
  title: 'UI/ContactsForm',
  component: ContactsForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ContactsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: {
      email: 'test@test.ru',
      phone: '79999999999',
    }
  },
  render: (props) => {
    const [state, setState] = useState(props.value);
    return (
      <ContactsForm value={state} onChange={value => {
        props.onChange(value);
        setState(value);
      }} />
    );
  }
};
