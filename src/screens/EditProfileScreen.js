import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ContextAuth } from '../context/AuthProvider';
import { api } from '../config/api';

export default function EditProfileScreen({ navigation }) {
  const { logout, user } = useContext(ContextAuth);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setNewUsername(user.user_login);
      setNewName(user.name || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!newUsername || !newName || !newPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await api.patch(`/users/${user.id}`, {
        user: {
          login: newUsername,
          name: newName,
          password: newPassword,
          password_confirmation: newPassword,
        },
      });

      if (response.status === 200) {
        Alert.alert('Usuário atualizado', 'Crie uma nova sessão');
        logout();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza de que deseja excluir sua conta? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.delete(`/users/${user.id}`);

              if (response.status === 200) {
                Alert.alert('Conta excluída com sucesso!');
                logout(); // Sai da conta e redireciona para a tela de login
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível excluir a conta. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de Usuário"
        value={newUsername}
        onChangeText={setNewUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      {/* Botão de Sair da Conta */}
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: '#657786', top: 10 }]}
        onPress={() => logout()}
      >
        <Text style={styles.cancelButtonText}>Sair da conta</Text>
      </TouchableOpacity>

      {/* Botão de Excluir Conta */}
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: '#FF3B30', top: 20 }]}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.cancelButtonText}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DA1F2',
    marginBottom: 20,
    textAlign: 'center',
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#657786',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
