import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEMOGRAPHIC_FEATURES, TIER } from '@/lib/constants';

interface SampleDataGeneratorProps {
  onDataGenerated: (data: any[]) => void;
}

const SampleDataGenerator: React.FC<SampleDataGeneratorProps> = ({ onDataGenerated }) => {
  const generateSampleData = () => {
    // List of sample markets
    const markets = [
      { id: 'CA', name: 'California', population: 39538223 },
      { id: 'TX', name: 'Texas', population: 29145505 },
      { id: 'FL', name: 'Florida', population: 21538187 },
      { id: 'NY', name: 'New York', population: 20201249 },
      { id: 'PA', name: 'Pennsylvania', population: 13002700 },
      { id: 'IL', name: 'Illinois', population: 12812508 },
      { id: 'OH', name: 'Ohio', population: 11799448 },
      { id: 'GA', name: 'Georgia', population: 10711908 },
      { id: 'NC', name: 'North Carolina', population: 10439388 },
      { id: 'MI', name: 'Michigan', population: 10077331 },
      { id: 'NJ', name: 'New Jersey', population: 9288994 },
      { id: 'VA', name: 'Virginia', population: 8631393 },
      { id: 'WA', name: 'Washington', population: 7693612 },
      { id: 'AZ', name: 'Arizona', population: 7151502 },
      { id: 'MA', name: 'Massachusetts', population: 7029917 },
      { id: 'TN', name: 'Tennessee', population: 6910840 },
      { id: 'IN', name: 'Indiana', population: 6785528 },
      { id: 'MO', name: 'Missouri', population: 6154913 },
      { id: 'MD', name: 'Maryland', population: 6177224 },
      { id: 'CO', name: 'Colorado', population: 5773714 },
    ];

    // Add demographic data and scores
    const data = markets.map((market, index) => {
      // Generate random demographic values
      const demographicData: Record<string, number> = {};
      DEMOGRAPHIC_FEATURES.forEach(feature => {
        demographicData[feature] = Math.random() * 100;
      });

      // Calculate a sample score based on demographics
      const score = 0.3 + (Math.random() * 0.7); // Score between 0.3 and 1.0
      
      // Determine tier based on score (higher score = better tier)
      let tier = 'Tier 4';
      if (score > 0.85) tier = 'Tier 1';
      else if (score > 0.7) tier = 'Tier 2';
      else if (score > 0.5) tier = 'Tier 3';
      
      // Generate sample market rank within tier
      const tierRank = Math.floor(Math.random() * 5) + 1;

      return {
        Market: market.id,
        MarketName: market.name,
        Population: market.population,
        Score: score,
        [TIER]: tier,
        TierRank: tierRank,
        ...demographicData
      };
    });

    onDataGenerated(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>No Data? Generate Sample Data</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Generate sample market data for testing the visualization features.
          This will create 20 markets with demographic features and scoring.
        </p>
        <Button onClick={generateSampleData}>Generate Sample Data</Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataGenerator;