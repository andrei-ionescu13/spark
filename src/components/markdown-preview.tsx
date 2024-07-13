import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { FC } from 'react';
import { AppBar, Box, Container, Dialog, InputBase, Toolbar, Typography, styled } from '@mui/material';
import { markdownToHtml } from '@/utils/markdown-to-html';
import Image from 'next/image';
import { Button } from '@/components/button';

interface MarkdownPreviewProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  cover?: string;
  markdown?: string;
  onSave?: any;
}

const Markdown = styled('div')(({ theme }) => ({
  p: {
    fontSize: 14,
    marginBottom: theme.spacing(4)
  }
}))

export const MarkdownPreview: FC<MarkdownPreviewProps> = (props) => {
  const { title, cover, markdown: markdownProp = '', open, onClose, onSave } = props;
  const [content, setContent] = useState('');
  const [markdown, setMarkdown] = useState(markdownProp);

  const handleMarkdownChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMarkdown(event.target.value)
  }

  useEffect(() => {
    (async () => {
      const transformed = await markdownToHtml(markdown)
      setContent(transformed);
    })()
  }, [markdown])

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        pt: 8,
        display: 'flex',
        flexDirection: 'column'
      }}
      PaperProps={{
        sx: {
          backgroundColor: !!onSave ? undefined : '#F3F6F5',
        }
      }}
    >
      <AppBar
        position="fixed"
        sx={{ backgroundColor: 'background.paper' }}
        elevation={1}
      >
        <Toolbar>
          <Typography
            color="textPrimary"
            sx={{ ml: 2 }}
            variant="h6"
          >
            Markdown Preview
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gap: 2
            }}
          >
            <Button
              color="secondary"
              onClick={onClose}
              variant="text"
              size="large"
            >
              Close
            </Button>
            {onSave && (
              <Button
                size="large"
                autoFocus
                color="primary"
                onClick={() => { onSave(markdown); onClose(); }}
                variant="contained"
              >
                Save
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          overflow: onSave ? 'hidden' : 'initial',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: !!onSave ? undefined : 'background.default',
          flex: 1,
          img: {
            maxWidth: '100%'
          }
        }}
      >
        <Container
          disableGutters={!!onSave}
          maxWidth={!!onSave ? false : 'md'}
          sx={{
            display: 'grid',
            gridTemplateColumns: !!onSave ? '4fr 8fr' : '1fr',
            flex: 1,
            height: '100%'
          }}
        >
          {!!onSave && (
            <Box
              sx={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                '&::-webkit-scrollbar-track': {
                  background: '#fff'
                },
              }}
            >
              <InputBase
                fullWidth
                multiline
                value={markdown}
                onChange={handleMarkdownChange}
                id="markdown"
                name="markdown"
                sx={{
                  alignItems: 'flex-start',
                  p: 5,
                  flex: 1
                }}
              />
            </Box>
          )}
          <Box sx={{
            backgroundColor: 'background.default',
            p: 5,
            height: '100%',
            overflow: onSave ? 'auto' : 'initial',
          }}>
            {cover && (
              <Image
                src={cover}
                alt={title || 'cover'}
                layout="responsive"
                width={16}
                height={9}
                priority
              />
            )}
            <Typography
              color="textPrimary"
              variant="h3"
              component="h1"
            >
              {title}
            </Typography>
            <Markdown dangerouslySetInnerHTML={{ __html: content }} />
          </Box>
        </Container>
      </Box>
    </Dialog>
  );
}