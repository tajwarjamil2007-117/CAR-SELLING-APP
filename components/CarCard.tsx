import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Car, money, miles, monthly } from '../lib/data';
import { useApp } from '../lib/store';
import { Txt, Icon, fonts } from './UI';

export default function CarCard({ car, onPress, index = 0 }: { car: Car; onPress: () => void; index?: number }) {
  const { theme, saved, toggleSaved } = useApp();
  const [imageError, setImageError] = useState(false);
  const isSaved = saved.includes(car.id);
  const privateSeller = car.own || car.seller === 'Alex Chen';
  const initials = car.seller.split(' ').slice(0, 2).map(word => word[0]).join('');
  return <Animated.View entering={FadeInDown.duration(320).delay(Math.min(index, 5) * 45)} style={{ flex: 1 }}><Pressable accessibilityRole="button" accessibilityLabel={`View ${car.year} ${car.make} ${car.model}`} onPress={onPress} style={({ hovered, pressed }: any) => ({ flex: 1, backgroundColor: theme.surface, borderWidth: 1, borderColor: hovered ? '#B9C7AE' : theme.border, borderRadius: 17, overflow: 'hidden', transform: [{ translateY: hovered ? -3 : 0 }], opacity: pressed ? .93 : 1, shadowColor: '#273624', shadowOffset: { width: 0, height: hovered ? 10 : 4 }, shadowOpacity: hovered ? .12 : .045, shadowRadius: hovered ? 22 : 14, elevation: 3 })}>
    <View style={{ width: '100%', aspectRatio: 1.8, backgroundColor: theme.soft }}>
      {imageError ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Icon name="car-sport-outline" size={40} /><Txt style={{ marginTop: 8, color: theme.muted }}>Photo unavailable</Txt></View> : <Image source={car.image} accessibilityLabel={`${car.make} ${car.model} listing photo`} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={Platform.OS === 'web' ? 0 : 250} loading={index < 3 ? 'eager' : 'lazy'} priority={index < 3 ? 'high' : 'normal'} onError={() => setImageError(true)} />}
      <LinearGradient pointerEvents="none" colors={['#10231900', '#10231900', '#10231980']} locations={[0, .5, 1]} style={{ position: 'absolute', inset: 0 }} />
      {car.badge && <View style={{ position: 'absolute', top: 13, left: 13, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: car.badge === 'Drivn pick' ? '#E5F2D4' : '#FFFFFFED', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 9 }}>{car.badge === 'Drivn pick' && <Icon name="sparkles-outline" size={12} color="#3D5934" />}<Txt style={{ color: '#34472D', fontFamily: fonts.semibold, fontSize: 10 }}>{car.badge}</Txt></View>}
      <Pressable accessibilityRole="button" accessibilityLabel={isSaved ? 'Unsave car' : 'Save car'} onPress={e => { e.stopPropagation(); toggleSaved(car.id); }} style={({ pressed }) => ({ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 20, backgroundColor: '#FFFFFFEE', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? .88 : 1 }] })}><Icon name={isSaved ? 'heart' : 'heart-outline'} color={isSaved ? '#425F32' : '#344038'} size={18} /></Pressable>
      <View style={{ position: 'absolute', bottom: 13, left: 15, flexDirection: 'row', gap: 5, alignItems: 'center' }}><Icon name="location-outline" size={13} color="#fff" /><Txt style={{ color: '#fff', fontSize: 11, fontFamily: fonts.medium }}>{car.location.split(',')[0]}</Txt></View><View style={{ position: 'absolute', bottom: 12, right: 14, flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5, backgroundColor: '#17261F85' }}><Icon name="images-outline" size={11} color="#fff" /><Txt style={{ color: '#fff', fontSize: 10 }}>1 photo</Txt></View>
    </View>
    <View style={{ padding: 19, paddingTop: 17 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}><Txt style={{ color: theme.muted, fontSize: 10, fontFamily: fonts.medium, letterSpacing: .7 }}>{car.year} · {car.type.toUpperCase()}</Txt><Txt style={{ color: theme.muted, fontSize: 10 }}>{car.own ? 'Your listing' : 'Pre-owned'}</Txt></View>
      <Txt numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 18, letterSpacing: -.45 }}>{car.make} {car.model}</Txt>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 10 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Icon name="speedometer-outline" size={13} color={theme.muted} /><Txt style={{ fontSize: 11, color: theme.muted }}>{miles(car.mileage)}</Txt></View><Txt style={{ color: theme.border }}>·</Txt><Txt style={{ fontSize: 11, color: theme.muted }}>{car.fuel}</Txt><Txt style={{ color: theme.border }}>·</Txt><Txt style={{ fontSize: 11, color: theme.muted }}>{car.transmission === 'Automatic' ? 'Auto' : 'Manual'}</Txt></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 17 }}><Txt style={{ fontFamily: fonts.bold, fontSize: 26, letterSpacing: -.9 }}>{money(car.price)}</Txt><View style={{ alignItems: 'flex-end', gap: 3 }}><Txt style={{ fontSize: 11, fontFamily: fonts.medium }}>Est. {money(monthly(car.price))}/mo</Txt><Txt style={{ fontSize: 9, color: theme.muted }}>20% down · 72 months</Txt></View></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 16, paddingTop: 13, borderTopWidth: 1, borderColor: theme.border }}><View style={{ width: 29, height: 29, borderRadius: 9, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}><Txt style={{ fontSize: 9, fontFamily: fonts.bold, color: theme.forest }}>{initials}</Txt></View><View style={{ flex: 1, gap: 3 }}><Txt numberOfLines={1} style={{ fontSize: 10, fontFamily: fonts.semibold }}>{car.seller}</Txt><Txt style={{ fontSize: 9, color: theme.muted }}>{car.own ? 'Your local listing' : privateSeller ? 'Private seller · Demo listing' : 'Independent dealer · Demo listing'}</Txt></View><Icon name="arrow-forward" size={16} color={theme.muted} /></View>
    </View>
  </Pressable></Animated.View>;
}
