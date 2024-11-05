import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useQueryMultipleValues } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Language, Namespace } from '@/types/translations';
import { Box, Card, TableBody } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState, type FC } from 'react';
import { TranslationsTableRow } from '../(page)/translations-table-row';
import { LanguagesMenu } from '../languages-menu';

interface TranslationsTableProps {
  languages?: Language[];
  namespace?: Namespace;
  count?: number;
  isLoading: boolean;
  isError: boolean;
  refetch: any;
}

export const TranslationsTable: FC<TranslationsTableProps> = (props) => {
  const { languages, namespace, count, isLoading, isError, refetch } = props;
  const [selectedLanguagesParam] = useQueryMultipleValues('language');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    selectedLanguagesParam
  );
  const [keyword, handleKeywordChange, handleSearch] = useSearch();

  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

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

  const displayedLanguages = !selectedLanguagesParam.length
    ? languages
    : languages?.filter((language) =>
        selectedLanguagesParam?.includes(language.code)
      );

  const headCells: HeadCell[] = [
    {
      id: 'key',
      label: 'Key',
    },
    ...(displayedLanguages || []).map((language) => ({
      label: language.name,
      id: language.code,
    })),
  ];

  const handleSelectLanguage = (_: any, languageCode: string) => {
    if (selectedLanguages.includes(languageCode)) {
      setSelectedLanguages(
        selectedLanguages.filter((code) => code !== languageCode)
      );
      return;
    }

    setSelectedLanguages([...selectedLanguages, languageCode]);
  };

  return (
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
        headCellsCount={headCells.length}
        hasCheckbox={false}
        hasError={isError}
        hasNoData={count === 0}
        onRefetchData={refetch}
      >
        <TableBody>
          {namespace &&
            languages &&
            displayedLanguages &&
            namespace.translations.map((translation) => (
              <TranslationsTableRow
                languages={languages}
                translation={translation}
                key={translation.key}
                shownLanguages={displayedLanguages}
                namespaceId={namespace._id}
              />
            ))}
        </TableBody>
      </DataTable>
    </Card>
  );
};
