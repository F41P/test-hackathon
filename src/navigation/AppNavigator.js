import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen'; 
import AddPlotScreen from '../screens/AddPlotScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import PlotDetailScreen from '../screens/PlotDetailScreen';
import CompareScreen from '../screens/CompareScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator> 
      {!isLoggedIn ? (
        <>
          {/* กลุ่มหน้า Auth (ซ่อน Header) */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="OTP" 
            component={OTPScreen} 
            options={{ headerShown: false }} 
          />
        </>
      ) : (
        <>
          {/* กลุ่มหน้า Main (หลังจาก Login) */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AddPlot" 
            component={AddPlotScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='AddTransaction'
            component={AddTransactionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PlotDetail" 
            component={PlotDetailScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Compare" 
            component={CompareScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ExpenseDetail" 
            component={ExpenseDetailScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;