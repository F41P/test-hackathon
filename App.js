import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator.js'; 
import { AuthProvider } from './src/context/AuthContext.js';
import { PlotProvider } from './src/navigation/PlotContext.js';
export default function App() {
  return (
    <PlotProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PlotProvider>
  );
}