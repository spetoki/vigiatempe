
"use client";

import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface UserMapProps {
    users: User[];
    loading: boolean;
}

export function UserMap({ users, loading }: UserMapProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mapa de Localização dos Usuários</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                ) : (
                    <div className="rounded-lg overflow-hidden border bg-muted relative h-[500px]">
                        <Image 
                            src="https://placehold.co/1200x600.png" 
                            alt="Mapa de localização de usuários" 
                            fill
                            className="object-cover"
                            data-ai-hint="world map" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center p-4 bg-background/80 rounded-lg shadow-lg max-w-sm">
                                <MapPin className="mx-auto h-12 w-12 text-primary mb-2" />
                                <h3 className="text-xl font-semibold">Visualização de Mapa</h3>
                                <p className="text-muted-foreground text-sm">
                                    Funcionalidade de mapa interativo para visualizar a localização dos usuários em tempo real está em desenvolvimento.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
