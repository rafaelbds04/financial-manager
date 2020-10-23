import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';

interface SelectionList {
    name: string,
    value: string | number
}

interface SelectionHorizontalListProps {
    data: SelectionList[],
    seleted: string | number,
    onChangeSeleted: Function
}

const SelectionHorizontalList: React.FC<SelectionHorizontalListProps> = ({data, seleted, onChangeSeleted}) => {

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.name}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={[styles.item,
                        (item.value === seleted && styles.active)]}
                            onPress={() => onChangeSeleted(item.value)}>
                            <Text style={styles.text} >{item.name}</Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    );
}

export default SelectionHorizontalList;