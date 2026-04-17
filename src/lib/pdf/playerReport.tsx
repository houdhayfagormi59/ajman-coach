import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Player, Injury, Performance, Evaluation } from '@/lib/types';

export const PlayerReport = ({
  player,
  injuries,
  performances,
  evaluation,
  coachName,
  generatedAt,
}: {
  player: Player;
  injuries: Injury[];
  performances: Performance[];
  evaluation: Evaluation | null;
  coachName: string;
  generatedAt: string;
}) => {
  return (
    <Document>
      <Page>
        <View>
          <Text>
            {player.first_name} {player.last_name}
          </Text>
          <Text>Coach: {coachName}</Text>
          <Text>Date: {generatedAt}</Text>
        </View>
      </Page>
    </Document>
  );
};