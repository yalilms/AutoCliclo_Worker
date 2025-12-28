import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Boton } from './src/components/common/Boton';
import { Input } from './src/components/common/Input';
import { Card } from './src/components/common/Card';
import { colores } from './src/theme/colores';
import { espaciado } from './src/theme/espaciado';
import { inicializarBaseDatos } from './src/database/dataBase';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);
  const [dbInicializada, setDbInicializada] = useState(false);

  // Inicializar base de datos
  useEffect(() => {
    const iniciarDB = async () => {
      try {
        await inicializarBaseDatos();
        setDbInicializada(true);
        console.log('✅ Base de datos inicializada');
      } catch (error) {
        console.error('❌ Error al inicializar BD:', error);
        Alert.alert('Error', 'No se pudo inicializar la base de datos');
      }
    };

    iniciarDB();
  }, []);

  const manejarEnvio = () => {
    setCargando(true);

    setTimeout(() => {
      setCargando(false);
      Alert.alert(
        '¡Éxito!',
        `Nombre: ${nombre}\nEmail: ${email}`,
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  return (
    <View style={estilos.container}>
      <StatusBar style="dark" />

      <ScrollView style={estilos.scrollView} contentContainerStyle={estilos.contenido}>
        {/* Header */}
        <View style={estilos.header}>
          <Text style={estilos.titulo}>🚗 AutoCiclo Mobile</Text>
          <Text style={estilos.subtitulo}>Gestión de Desguace</Text>
          {dbInicializada && (
            <Text style={estilos.estadoDB}>✅ Base de datos lista</Text>
          )}
        </View>

        {/* Card de prueba 1: Componentes básicos */}
        <Card estilo={estilos.card}>
          <Text style={estilos.cardTitulo}>Prueba de Componentes</Text>

          <Input
            etiqueta="Nombre"
            placeholder="Escribe tu nombre"
            value={nombre}
            onChangeText={setNombre}
            exito={nombre.length > 3}
          />

          <Input
            etiqueta="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={email && !email.includes('@') ? 'Email inválido' : undefined}
          />

          <Boton
            titulo="Enviar"
            onPress={manejarEnvio}
            variante="primario"
            cargando={cargando}
          />
        </Card>

        {/* Card de prueba 2: Variantes de botones */}
        <Card estilo={estilos.card}>
          <Text style={estilos.cardTitulo}>Variantes de Botones</Text>

          <Boton
            titulo="Primario"
            onPress={() => Alert.alert('Botón Primario')}
            variante="primario"
            estilo={estilos.boton}
          />

          <Boton
            titulo="Secundario"
            onPress={() => Alert.alert('Botón Secundario')}
            variante="secundario"
            estilo={estilos.boton}
          />

          <Boton
            titulo="Éxito"
            onPress={() => Alert.alert('Botón Éxito')}
            variante="exito"
            estilo={estilos.boton}
          />

          <Boton
            titulo="Peligro"
            onPress={() => Alert.alert('Botón Peligro')}
            variante="peligro"
            estilo={estilos.boton}
          />

          <Boton
            titulo="Deshabilitado"
            onPress={() => {}}
            variante="primario"
            deshabilitado
            estilo={estilos.boton}
          />
        </Card>

        {/* Card de prueba 3: Estados de vehículo */}
        <Card estilo={estilos.card}>
          <Text style={estilos.cardTitulo}>Estados de Vehículo</Text>

          <View style={estilos.estadoContainer}>
            <View style={[estilos.estadoChip, { backgroundColor: colores.completo }]}>
              <Text style={estilos.estadoTexto}>Completo</Text>
            </View>

            <View style={[estilos.estadoChip, { backgroundColor: colores.desguazando }]}>
              <Text style={estilos.estadoTexto}>Desguazando</Text>
            </View>

            <View style={[estilos.estadoChip, { backgroundColor: colores.desguazado }]}>
              <Text style={estilos.estadoTexto}>Desguazado</Text>
            </View>
          </View>
        </Card>

        {/* Card de prueba 4: Categorías de piezas */}
        <Card estilo={estilos.card}>
          <Text style={estilos.cardTitulo}>Categorías de Piezas</Text>

          <View style={estilos.categoriaContainer}>
            <View style={[estilos.categoriaChip, { backgroundColor: colores.motor }]}>
              <Text style={estilos.categoriaTexto}>Motor</Text>
            </View>

            <View style={[estilos.categoriaChip, { backgroundColor: colores.carroceria }]}>
              <Text style={estilos.categoriaTexto}>Carrocería</Text>
            </View>

            <View style={[estilos.categoriaChip, { backgroundColor: colores.interior }]}>
              <Text style={estilos.categoriaTexto}>Interior</Text>
            </View>

            <View style={[estilos.categoriaChip, { backgroundColor: colores.electronica }]}>
              <Text style={estilos.categoriaTexto}>Electrónica</Text>
            </View>

            <View style={[estilos.categoriaChip, { backgroundColor: colores.ruedas }]}>
              <Text style={estilos.categoriaTexto}>Ruedas</Text>
            </View>

            <View style={[estilos.categoriaChip, { backgroundColor: colores.otros }]}>
              <Text style={estilos.categoriaTexto}>Otros</Text>
            </View>
          </View>
        </Card>

        {/* Card presionable */}
        <Card
          presionable
          onPress={() => Alert.alert('Card Presionado', 'Esta tarjeta es presionable')}
          estilo={estilos.card}
        >
          <Text style={estilos.cardTitulo}>📱 Card Presionable</Text>
          <Text style={estilos.cardDescripcion}>
            Toca esta tarjeta para ver el efecto
          </Text>
        </Card>

        <View style={estilos.footer}>
          <Text style={estilos.footerTexto}>
            AutoCiclo Mobile v1.0 - Día 1-2 Completado ✅
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  scrollView: {
    flex: 1,
  },
  contenido: {
    padding: espaciado.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: espaciado.xl,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colores.primario,
    marginBottom: espaciado.sm,
  },
  subtitulo: {
    fontSize: 16,
    color: colores.textoSecundario,
    marginBottom: espaciado.xs,
  },
  estadoDB: {
    fontSize: 12,
    color: colores.exito,
    marginTop: espaciado.sm,
  },
  card: {
    marginBottom: espaciado.md,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colores.texto,
    marginBottom: espaciado.md,
  },
  cardDescripcion: {
    fontSize: 14,
    color: colores.textoSecundario,
  },
  boton: {
    marginBottom: espaciado.sm,
  },
  estadoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
  },
  estadoChip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: 20,
  },
  estadoTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoriaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaciado.sm,
  },
  categoriaChip: {
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    borderRadius: 20,
  },
  categoriaTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: espaciado.xl,
  },
  footerTexto: {
    fontSize: 12,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
});
