import type { FC } from 'react';
import type { Language } from '../../types/translations';
import { CheckboxMenu } from '../checkbox-menu';
import type { CheckboxMenuOption } from '../checkbox-menu';

interface LanguagesMenuProps {
  languages: Language[];
  selectedLanguageCodes: string[];
  onSelect: any;
}

export const LanguagesMenu: FC<LanguagesMenuProps> = (props) => {
  const { languages, selectedLanguageCodes, onSelect } = props;

  const options: CheckboxMenuOption[] = languages.map((language) => ({
    label: language.name,
    value: language.code
  }))

  return (
    <CheckboxMenu
      buttonLabel="Languages"
      optionsKey="language"
      options={options}
      onSelect={onSelect}
      verifyIsChecked={(_: any, value: any) => selectedLanguageCodes?.includes(value)}
    />
  )
}
