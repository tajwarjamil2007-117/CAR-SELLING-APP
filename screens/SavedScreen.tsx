import React, { useState } from 'react';
import { FlatList, Pressable, Switch, View, useWindowDimensions, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useApp } from '../lib/store';
import { Car, money, miles, monthly } from '../lib/data';
import { Button, EmptyState, fonts, Icon, PageHeading, Sheet, Txt } from '../components/UI';
import CarCard from '../components/CarCard';
export default function SavedScreen({ navigation }: any) {
  const { theme, inventory, saved, notify } = useApp(); const { width } = useWindowDimensions();
  const cols = width > 1230 ? 3 : width > 730 ? 2 : 1;
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const data = inventory.filter(c => saved.includes(c.id));
  const selectedCars = data.filter(car => selected.includes(car.id));
  const chooseCar = (id: string) => {
    const current = selectedCars.map(car => car.id);
    if (current.includes(id)) setSelected(current.filter(value => value !== id));
    else if (current.length === 3) notify('Compare up to three cars. Deselect one to make room.');
    else setSelected([...current, id]);
  };
  const comparisonRows: { label: string; value: (car: Car) => string; best?: (car: Car) => boolean }[] = [
    { label: 'Asking price', value: car => money(car.price), best: car => car.price === Math.min(...selectedCars.map(c => c.price)) },
    { label: 'Mileage', value: car => miles(car.mileage), best: car => car.mileage === Math.min(...selectedCars.map(c => c.mileage)) },
    { label: 'Est. monthly payment', value: car => `${money(monthly(car.price))}/mo` },
    { label: 'Model year', value: car => String(car.year) },
    { label: 'Body style', value: car => car.type },
    { label: 'Fuel type', value: car => car.fuel },
    { label: 'Transmission', value: car => car.transmission },
    { label: 'Power', value: car => car.horsepower ? `${car.horsepower} hp` : 'Not specified' },
    { label: 'Exterior color', value: car => car.color },
    { label: 'Location', value: car => car.location },
  ];
  const visibleRows = comparisonRows.filter(row => !differencesOnly || new Set(selectedCars.map(row.value)).size > 1);
  return <View style={{ flex: 1, backgroundColor: theme.bg }}><FlatList data={data} key={cols} numColumns={cols} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: width < 650 ? 20 : 32, width: '100%', maxWidth: 1380, alignSelf: 'center' }} columnWrapperStyle={cols > 1 ? { marginHorizontal: -8 } : undefined} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 500); }} />} ListHeaderComponent={<><PageHeading eyebrow="THE ONES THAT CAUGHT YOUR EYE" title="Good taste. Great possibilities." subtitle={`${data.length} ${data.length === 1 ? 'car' : 'cars'} saved for your next chapter. Take your time. The right one is worth it.`} action={width > 650 && <Button title="Keep exploring" icon="arrow-forward" variant="outline" onPress={() => navigation.navigate('Discover')} />} />{data.length > 0 && <View style={{ backgroundColor: theme.tint, borderRadius: 13, padding: 19, marginBottom: 22, flexDirection: width < 650 ? 'column' : 'row', alignItems: width < 650 ? 'stretch' : 'center', gap: 16 }}><View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}><Icon name="git-compare-outline" color={theme.forest} size={23} /><View style={{ flex: 1 }}><Txt style={{ fontFamily: fonts.bold, fontSize: 14 }}>A clearer view of your shortlist.</Txt><Txt style={{ fontSize: 11, color: theme.muted, lineHeight: 18, marginTop: 4 }}>{data.length < 2 ? 'Save one more car to compare side by side.' : `Choose 2–3 cars below · ${selectedCars.length} selected`}</Txt></View></View><View style={{ flexDirection: 'row', gap: 9 }}>{selectedCars.length > 0 && <Button title="Clear selection" variant="outline" onPress={() => setSelected([])} style={{ minHeight: 40, paddingHorizontal: 13 }} />}<Button title={`Compare (${selectedCars.length})`} icon="git-compare-outline" disabled={selectedCars.length < 2} onPress={() => setComparing(true)} style={{ minHeight: 40, paddingHorizontal: 15, flex: width < 650 ? 1 : undefined }} /></View></View>}</>} renderItem={({ item, index }) => <View style={{ flex: 1 / cols, paddingHorizontal: cols > 1 ? 8 : 0, marginBottom: 20 }}><CarCard car={item} index={index} onPress={() => navigation.navigate('CarDetail', { carId: item.id })} /><Pressable accessibilityRole="checkbox" accessibilityLabel={`Compare ${item.make} ${item.model}`} accessibilityState={{ checked: selected.includes(item.id) }} onPress={() => chooseCar(item.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 4 }}><Icon name={selected.includes(item.id) ? 'checkbox' : 'square-outline'} size={19} color={selected.includes(item.id) ? theme.forest : theme.muted} /><Txt style={{ fontFamily: fonts.medium, fontSize: 11, color: selected.includes(item.id) ? theme.forest : theme.muted }}>{selected.includes(item.id) ? 'Selected for comparison' : 'Add to comparison'}</Txt></Pressable></View>} ListEmptyComponent={<EmptyState icon="heart-outline" title="Your shortlist starts here." description="See something you love? Tap the heart on any car to keep it here for later." action="Find your next car" onAction={() => navigation.navigate('Discover')} />} />
    <Sheet visible={comparing} wide title="The details make the difference." subtitle="Your favorites, side by side. Swipe across to see every car." onClose={() => setComparing(false)} footer={<Button title="Back to my shortlist" variant="outline" onPress={() => setComparing(false)} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 19 }}><Txt style={{ fontFamily: fonts.semibold, fontSize: 12 }}>Show differences only</Txt><Switch accessibilityLabel="Show differences only" value={differencesOnly} onValueChange={setDifferencesOnly} trackColor={{ false: theme.border, true: '#A7CF62' }} thumbColor={theme.surface} /></View>
      <FlatList horizontal data={selectedCars} keyExtractor={car => car.id} showsHorizontalScrollIndicator contentContainerStyle={{ gap: 12, paddingBottom: 12 }} renderItem={({ item: car }) => <View style={{ width: width < 650 ? 210 : selectedCars.length === 2 ? 298 : 220, borderWidth: 1, borderColor: theme.border, borderRadius: 12, overflow: 'hidden', backgroundColor: theme.surface }}>
        <Image source={car.image} contentFit="cover" style={{ width: '100%', height: 124, backgroundColor: theme.soft }} />
        <View style={{ height: 76, padding: 14, justifyContent: 'center' }}><Txt style={{ fontSize: 10, color: theme.muted, marginBottom: 4 }}>{car.year} · {car.make}</Txt><Txt numberOfLines={2} style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 }}>{car.model}</Txt></View>
        {visibleRows.map(row => <View key={row.label} style={{ height: 76, paddingHorizontal: 14, justifyContent: 'center', borderTopWidth: 1, borderColor: theme.border, backgroundColor: row.best?.(car) ? theme.tint : theme.surface }}><Txt style={{ color: theme.muted, fontSize: 10, marginBottom: 5 }}>{row.label}</Txt><View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><Txt numberOfLines={2} style={{ fontFamily: fonts.semibold, fontSize: row.label === 'Asking price' ? 21 : 13, flexShrink: 1 }}>{row.value(car)}</Txt>{row.best?.(car) && <Icon name="checkmark-circle" color={theme.forest} size={14} />}</View></View>)}
        <View style={{ padding: 13, borderTopWidth: 1, borderColor: theme.border }}><Button title="View car" icon="arrow-forward" variant="soft" onPress={() => { setComparing(false); navigation.navigate('CarDetail', { carId: car.id }); }} /></View>
      </View>} />
      {differencesOnly && visibleRows.length === 0 && <Txt style={{ color: theme.muted, fontSize: 12, marginTop: 12 }}>These cars share the same listed specifications.</Txt>}
      <Txt style={{ fontSize: 10, color: theme.muted, lineHeight: 18, marginTop: 16 }}>Green highlights indicate the lowest price and mileage among your selections, including ties. Sample listings only. Monthly estimates assume 20% down, 72 months, and an illustrative 6.5% APR; taxes and fees are excluded.</Txt>
    </Sheet>
  </View>;
}
