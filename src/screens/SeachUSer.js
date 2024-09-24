import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { api } from '../config/api';

export default function SearchUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(()=>{
  getUser();
  },[])

  const handleSearch = async () => {
    if (!searchQuery) return; // Não faz a busca se a consulta estiver vazia
    try {
      const response = await api.get(`/users?search=${searchQuery}`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Erro ao buscar usuários', ToastAndroid.SHORT);
    }
  };
  const getUser = async () => {
   try {
    const User =await api.get(`/users`);
    setUsers(User.data);
   } catch (error) {
    
   }
  };

  const handleFollow = async (login) => {
    try {
      await api.post(`/users/${login}/followers`);
      ToastAndroid.show(`Você está seguindo ${login}!`, ToastAndroid.SHORT);
      // Atualize a lista de usuários se necessário
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Erro ao seguir usuário', ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userText}>Nome: {item.name}</Text>
      <Text style={styles.userText}>Login: {item.login}</Text>
      <TouchableOpacity 
        style={styles.followButton} 
        onPress={() => handleFollow(item.login)}
      >
        <Text style={styles.followButtonText}>Seguir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Buscar Usuários" 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        onSubmitEditing={handleSearch} // Chama a função de busca quando o usuário pressionar Enter
      />
      <FlatList 
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  userContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  followButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
