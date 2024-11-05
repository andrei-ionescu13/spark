'use client';

import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useQueryMultipleValues } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Language, Namespace } from '@/types/translations';
import { Box, Card, TableBody } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState, type FC } from 'react';
import { LanguagesMenu } from '../languages-menu';
import { NamespaceTableRow } from './namespace-table-row';

interface NamespacesTableProps {
  languages?: Language[];
  namespaces?: Namespace[];
  count?: number;
  isLoading: boolean;
  isError: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: 'name',
    label: 'Namespace',
  },
];

export const NamespacesTable: FC<NamespacesTableProps> = (props) => {
  const { languages, namespaces, count, isLoading, isError, refetch } = props;
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selectedLanguagesParam] = useQueryMultipleValues('language');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    selectedLanguagesParam
  );

  const shownLanguageCodes = (() => {
    if (query?.language) {
      if (typeof query.language === 'string') {
        return [query.language];
      }

      return query.language;
    }

    if (languages) {
      return languages.map((language) => language.code);
    }

    return [];
  })();

  const handleSelectLanguage = (_: any, languageCode: string) => {
    if (selectedLanguages.includes(languageCode)) {
      setSelectedLanguages(
        selectedLanguages.filter((code) => code !== languageCode)
      );
      return;
    }

    setSelectedLanguages([...selectedLanguages, languageCode]);
  };

  const shownLanguages = languages?.filter((language) =>
    shownLanguageCodes?.includes(language.code)
  );

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: '1fr 160px',
            },
            p: 2,
          }}
        >
          <form
            onSubmit={(event) => {
              handleSearch(event, {
                language: selectedLanguages,
              });
            }}
          >
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search..."
              value={keyword}
            />
          </form>
          <LanguagesMenu
            languages={languages || []}
            selectedLanguageCodes={selectedLanguages}
            onSelect={handleSelectLanguage}
          />
        </Box>
        <DataTable
          count={count}
          headSlot={<DataTableHead headCells={headCells} />}
          isLoading={isLoading}
          headCellsCount={1}
          hasCheckbox={false}
          hasError={isError}
          hasNoData={count === 0}
          onRefetchData={refetch}
        >
          <TableBody>
            {namespaces?.map((namespace) => (
              <NamespaceTableRow
                keyword={keyword}
                languages={languages || []}
                namespace={namespace}
                key={namespace.name}
                shownLanguages={shownLanguages || []}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
    </>
  );
};
