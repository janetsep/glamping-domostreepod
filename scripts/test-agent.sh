#!/bin/bash

# 🤖 Script del Agente de Testing Funcional
# Ejecuta todos los tests y genera reporte completo

echo "🤖 Iniciando Agente de Testing Funcional para Glamping..."
echo "=================================================="

# Verificar que el servidor esté corriendo
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Servidor no detectado en localhost:8080"
    echo "🚀 Iniciando servidor de desarrollo..."
    npm run dev &
    SERVER_PID=$!
    
    # Esperar que el servidor esté listo
    echo "⏳ Esperando que el servidor esté listo..."
    while ! curl -s http://localhost:8080 > /dev/null; do
        sleep 2
        echo "   Esperando servidor..."
    done
    echo "✅ Servidor listo!"
else
    echo "✅ Servidor detectado en localhost:8080"
fi

echo ""
echo "🔍 Ejecutando tests del agente..."
echo "=================================="

# Ejecutar tests con reporte
npm run test:e2e

# Capturar código de salida
TEST_EXIT_CODE=$?

echo ""
echo "📊 Generando reporte..."
echo "======================="

# Mostrar reporte
npm run test:e2e:report &

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "🎉 ¡AGENTE COMPLETADO EXITOSAMENTE!"
    echo "=================================="
    echo "✅ Todos los tests pasaron"
    echo "✅ El sitio web está funcionando correctamente"
    echo "📊 Reporte disponible en: http://localhost:9323"
else
    echo ""
    echo "⚠️  AGENTE DETECTÓ PROBLEMAS"
    echo "============================"
    echo "❌ Algunos tests fallaron"
    echo "🔍 Revisa el reporte para más detalles"
    echo "📊 Reporte disponible en: http://localhost:9323"
fi

# Limpiar proceso del servidor si lo iniciamos nosotros
if [ ! -z "$SERVER_PID" ]; then
    echo ""
    echo "🧹 Limpiando servidor..."
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "🤖 Agente de Testing Funcional finalizado."

exit $TEST_EXIT_CODE