import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import {
  Divider,
  Tooltip,
  TextField,
  Typography,
  DialogTitle,
  CircularProgress,
} from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';
import { clearSearch, searchLists, setSearchQuery } from 'src/redux/slice/listSlice';
import { ResultItem } from './result-item';

export default function Searchbar({ sx, ...other }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { searchQuery, searchResults, loading, error, selectedList } = useSelector(
    (state) => state.list
  );

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    dispatch(clearSearch());
  };

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        dispatch(searchLists(searchQuery));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, dispatch]);

  const handleSearch = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleItemClick = (item) => {
    // Handle item selection logic here
    handleClose();
  };

  const handleClearSearch = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const renderItems = () => (
    <Box component="ul">
      {searchResults.listData?.map((item) => (
        <Box
          component="li"
          key={item.jobId}
          sx={{ display: 'flex' }}
          onClick={() => handleItemClick(item)}
        >
          <ResultItem
            item={item}
            title={item.title || item.listName}
            groupLabel={searchQuery && 'Filtered'}
            searchQuery={searchQuery}
          />
        </Box>
      ))}
    </Box>
  );

  const renderButton = (
    <Tooltip title="Search Lists to see reports." arrow placement="bottom">
      <Box
        display="flex"
        alignItems="center"
        onClick={handleOpen}
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color: 'grey.600',
          pr: { sm: 1 },
          borderRadius: { sm: 1.5 },
          cursor: { sm: 'pointer' },
          bgcolor: { sm: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) },
          ...sx,
        }}
        {...other}
      >
        <Box display="flex" alignItems="center">
          <IconButton disableRipple>
            <SvgIcon sx={{ width: 20, height: 20 }}>
              <path
                fill="currentColor"
                d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
              />
            </SvgIcon>
          </IconButton>
        </Box>

        <Typography fontWeight={500} fontSize={14} ml={1} py={1}>
          Search report by list here.
        </Typography>

        {selectedList?.listName && (
          <Typography
            fontWeight={600}
            sx={{
              p: 0.5,
              borderRadius: 1,
              ml: 1,
              fontSize: 12,
              color: 'grey.800',
              bgcolor: 'common.white',
              boxShadow: theme.customShadows.z1,
              display: { xs: 'none', md: 'inline-flex' },
            }}
          >
            {selectedList.listName}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );

  return (
    <>
      {renderButton}

      <Dialog
        fullWidth
        disableRestoreFocus
        open={isOpen}
        onClose={handleClose}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
        sx={{
          [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' },
        }}
      >
        <Box>
          <DialogTitle sx={{ fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
            Search Email List
            <Iconify
              onClick={handleClose}
              icon="uil:times"
              style={{ width: 20, height: 20, cursor: 'pointer', color: '#637381' }}
            />
          </DialogTitle>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </Box>

        <Box sx={{ p: 2 }}>
          <Tooltip title="Enter the email list name." arrow placement="top">
            <TextField
              fullWidth
              size="large"
              placeholder="Search by email list name..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Iconify icon="eva:search-fill" width={24} height={24} />
                    )}
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <Iconify
                      icon="ic:round-clear"
                      style={{
                        cursor: 'pointer',
                        color: '#637381',
                      }}
                      onClick={handleClearSearch}
                    />
                  </InputAdornment>
                ) : null,
              }}
            />
          </Tooltip>
        </Box>

        {error && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {!loading && searchResults?.listData?.length === 0 ? (
          <SearchNotFound query={searchQuery} sx={{ py: 15 }} />
        ) : (
          <Scrollbar sx={{ px: 3, pb: 3, pt: 0, height: 400 }}>{renderItems()}</Scrollbar>
        )}
      </Dialog>
    </>
  );
}
