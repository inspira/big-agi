import * as React from 'react';
import Image from 'next/image';
import { Sheet, Typography, Container, Card, CardContent, IconButton } from '@mui/joy';
//import { Box, Button, Card, CardContent, Container, IconButton, Typography } from '@mui/joy';
import { useMarkNewsAsSeen } from './news.hooks';

import LogoAI from '../../assets/images/logo-AI.png';
import LogoInspira from '../../assets/images/logo-inspira.png';

import styles from './styles.module.scss';

export function AppNews() {
  // state
  const [lastNewsIdx, setLastNewsIdx] = React.useState<number>(0);
  const [keyword, setKeyword] = React.useState<string>('');
  const markNewsAsSeen = useMarkNewsAsSeen();

  // news selection

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markNewsAsSeen(keyword);
  };
  const white = '#ffffff';
  return (
    <Sheet
      variant="soft"
      invertedColors
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        overflowY: 'auto',
        minHeight: 96,
        p: { xs: 3, md: 6 },
        gap: 4,
        backgroundColor: white,
      }}
    >
      <div className={styles.container}>
        <Typography level="h1" className={styles.title}>
          <Image src={LogoAI} alt="Target Teal - AI" width="48" height="48" />
          Assistente IA
        </Typography>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Digite sua palavra-chave</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button type="submit">
            <span>Entrar</span>
          </button>
          <a href="https://targetteal.com/pt/ia/">Não tem uma palavra-chave?</a>
        </form>

        <div className={styles.footer}>
          <p>Uma solução desenvolvida com apoio da </p>
          <a href="https://www.inspira.com.br/#TargetTeal" target='_blank'><Image src={LogoInspira} alt="Inspira" width={80} height={21} /></a>
        </div>
      </div>
    </Sheet>
  );
}
