import { useSandboxContext } from '@/providers/SandboxProvider.tsx';
import CaroTable from '@/components/shared/CaroTable.tsx';
import { Box, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Props } from '@/types.ts';

interface SandboxProps extends Props {
  onBack?: () => void;
}

export default function SandBox({ onBack }: SandboxProps) {
  const { doMove, currentMoves, doReturn, doForward, canForward, canReturn, clearMoves } = useSandboxContext();

  return (
    <Box className='flex flex-row-reverse gap-2 '>
      <Box className='flex flex-col gap-2 border-2 border-black h-fit p-2 rounded-2xl shadow-custom bg-white'>
        <IconButton
          title='back'
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          onClick={doReturn}
          sx={{ color: 'black', border: '1px solid black' }}
          disabled={!canReturn}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          title='forward'
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          onClick={doForward}
          sx={{ color: 'black', border: '1px solid black' }}
          disabled={!canForward}>
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton
          title='reset'
          className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
          onClick={clearMoves}
          sx={{ color: 'black', border: '1px solid black' }}
          disabled={currentMoves.length <= 0}>
          <CloseOutlinedIcon />
        </IconButton>
        {onBack && (
          <IconButton
            className='shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
            onClick={onBack}
            sx={{ color: 'black', border: '1px solid black' }}>
            <ArrowBackIosNewIcon />
          </IconButton>
        )}
      </Box>
      <Box className='border-2 border-black rounded-2xl overflow-hidden'>
        <CaroTable doMove={doMove} currentMoves={currentMoves} />
      </Box>
    </Box>
  );
}
