export interface IConfigItem {
  name: string;
  label: string;
  is_editable: boolean;
  value: string;
}

export enum ConfigInputType {
  Text = 'text',
  Select = 'select',
  Toggle = 'toggle',
}

export interface IConfigOption {
  id: string;
  name: string;
}

const CONFIG_INPUT_TYPES: Record<string, ConfigInputType> = {
  company_name: ConfigInputType.Text,
  company_reg_type: ConfigInputType.Select,
  company_reg: ConfigInputType.Text,
  company_contact: ConfigInputType.Text,
  company_address: ConfigInputType.Text,
  company_email: ConfigInputType.Text,
  calendar_type: ConfigInputType.Select,
  default_rounding: ConfigInputType.Toggle,
};

const COMPANY_REG_TYPE_OPTIONS: IConfigOption[] = [
  { id: 'PAN', name: 'PAN' },
  { id: 'VAT', name: 'VAT' },
];

const CALENDAR_TYPE_OPTIONS: IConfigOption[] = [
  { id: 'BS', name: 'BS' },
  { id: 'AD', name: 'AD' },
];

const CONFIG_OPTIONS: Record<string, IConfigOption[]> = {
  company_reg_type: COMPANY_REG_TYPE_OPTIONS,
  calendar_type: CALENDAR_TYPE_OPTIONS,
};

export function getConfigInputType(name: string): ConfigInputType {
  return CONFIG_INPUT_TYPES[name] ?? ConfigInputType.Text;
}

export function getConfigOptions(name: string): IConfigOption[] | undefined {
  return CONFIG_OPTIONS[name];
}

export function getConfigDisplayValue(item: IConfigItem): string {
  const type = getConfigInputType(item.name);
  if (type === ConfigInputType.Toggle) {
    return item.value === '1' ? 'On' : 'Off';
  }
  return item.value || 'N/A';
}
