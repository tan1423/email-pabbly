/* eslint-disable consistent-return */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
// import { updateProgress, completeVerification } from 'src/redux/slice/uploadSlice';

// Import the necessary actions

export default function ProgressLinear() {
  const dispatch = useDispatch();
  const { progress, isStartVerification } = useSelector((state) => state.fileUpload);

  // Use effect to simulate uploading process
  // useEffect(() => {
  //   if (isStartVerification) {
  //     const interval = setInterval(() => {
  //       if (progress < 100) {
  //         dispatch(updateProgress(progress + 1)); // Increment progress by 1
  //       } else {
  //         clearInterval(interval); // Stop the interval when progress reaches 100
  //         // dispatch(completeVerification()); // Mark verification as completed
  //       }
  //     }, 100); // Update progress every 100ms

  //     return () => clearInterval(interval); // Cleanup on unmount
  //   }
  // }, [isStartVerification, progress, dispatch]);

  return (
    <Box sx={{ p: 3, pt: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="overline">
          {isStartVerification ? 'Processing' : 'Uploading'}
        </Typography>
        <Typography variant="subtitle1">{`${progress.toFixed(2)}%`}</Typography>
      </Box>

      <LinearProgress
        color={isStartVerification ? 'success' : 'warning'}
        variant="determinate"
        value={progress}
        sx={{
          width: 1,
          height: 8,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
          [`& .${linearProgressClasses.bar}`]: { opacity: 0.8 },
        }}
      />
    </Box>
  );
}
