import FormularioTenis from '@/components/formularioTenis';

export const metadata = {
  title: 'Editar tênis | Still Running',
};

export default async function EditarTenis({ params }) {
  const { id } = await params;
  return <FormularioTenis id={id} />;
}
