import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { RowInput } from '../services/shorten';
import { validateUrlRow } from '../utils/validation';

interface ShortenFormProps {
  rows: RowInput[];
  onRowChange: (index: number, field: keyof RowInput, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onSubmit: (rows: RowInput[]) => void;
  loading: boolean;
  canAddRow: boolean;
}

const ShortenForm: React.FC<ShortenFormProps> = ({
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
  onSubmit,
  loading,
  canAddRow,
}) => {
  const [errors, setErrors] = useState<Record<number, string[]>>({});

  const validateRows = (): boolean => {
    const newErrors: Record<number, string[]> = {};
    let hasErrors = false;

    rows.forEach((row, index) => {
      const validation = validateUrlRow(row.url, row.validity, row.shortcode);
      if (!validation.isValid) {
        newErrors[index] = validation.errors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateRows()) {
      // Filter out empty rows
      const validRows = rows.filter(row => row.url.trim());
      if (validRows.length > 0) {
        onSubmit(validRows);
      }
    }
  };

  const handleRowChange = (index: number, field: keyof RowInput, value: string) => {
    onRowChange(index, field, value);
    
    // Clear errors for this field when user starts typing
    if (errors[index]) {
      const newErrors = { ...errors };
      newErrors[index] = newErrors[index].filter(error => 
        !error.includes(field === 'url' ? 'URL' : 
                       field === 'validity' ? 'Validity' : 'Shortcode')
      );
      if (newErrors[index].length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        URL Details
      </Typography>
      
      {rows.map((row, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Long URL *"
                placeholder="https://example.com"
                value={row.url}
                onChange={(e) => handleRowChange(index, 'url', e.target.value)}
                error={!!errors[index]?.some(e => e.includes('URL'))}
                helperText={errors[index]?.find(e => e.includes('URL'))}
                disabled={loading}
                required
              />
              <TextField
                label="Validity (minutes)"
                placeholder="30"
                value={row.validity}
                onChange={(e) => handleRowChange(index, 'validity', e.target.value)}
                error={!!errors[index]?.some(e => e.includes('Validity'))}
                helperText={errors[index]?.find(e => e.includes('Validity')) || "Default: 30 minutes"}
                disabled={loading}
                sx={{ minWidth: 150 }}
              />
              <TextField
                label="Custom Shortcode"
                placeholder="auto-generated"
                value={row.shortcode}
                onChange={(e) => handleRowChange(index, 'shortcode', e.target.value)}
                error={!!errors[index]?.some(e => e.includes('Shortcode'))}
                helperText={errors[index]?.find(e => e.includes('Shortcode')) || "Leave empty for auto-generation"}
                disabled={loading}
                sx={{ minWidth: 150 }}
              />
              {rows.length > 1 && (
                <IconButton
                  onClick={() => onRemoveRow(index)}
                  disabled={loading}
                  color="error"
                  sx={{ mt: 1 }}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>
            
            {errors[index] && errors[index].length > 0 && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors[index].map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </Alert>
            )}
          </Stack>
          
          {index < rows.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      ))}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          type="button"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddRow}
          disabled={!canAddRow || loading}
        >
          Add Another URL
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || rows.every(row => !row.url.trim())}
        >
          {loading ? 'Creating...' : `Create ${rows.filter(row => row.url.trim()).length} Short URL${rows.filter(row => row.url.trim()).length !== 1 ? 's' : ''}`}
        </Button>
      </Box>

      {!canAddRow && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Maximum of 5 URLs can be shortened at once.
        </Alert>
      )}
    </Box>
  );
};

export default ShortenForm;
