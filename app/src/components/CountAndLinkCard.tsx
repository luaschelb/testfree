import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CountAndLinkCardProps {
  title: string;
  count: number;
  route: string;
}

const CountAndLinkCard: React.FC<CountAndLinkCardProps> = ({ title, count, route }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(route);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 300, 
        m: 2, 
        cursor: 'pointer', 
        boxShadow: 3, 
        '&:hover': { boxShadow: 6 },
        transition: 'box-shadow 0.3s ease-in-out',
      }} 
      onClick={handleNavigation}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" color="primary">
            {count}
          </Typography>
          <Button variant="text" color="secondary" onClick={handleNavigation}>
            Ver mais
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CountAndLinkCard;