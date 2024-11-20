'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Clipboard, Plus, Trash2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react';

type FormData = {
    environment: string
    qrType: string
    useCase: string
    campaignUrl: string
    title: string
    screen: string
    params: { key: string; value: string }[]
}

export default function Component() {
    const [generatedUrl, setGeneratedUrl] = useState('')

    const { control, handleSubmit, register } = useForm<FormData>({
        defaultValues: {
            environment: 'uat',
            qrType: 'deeplink',
            useCase: 'campaign',
            campaignUrl: '',
            title: '',
            screen: 'dop_native_introduction_screen',
            params: [{ key: 'utm_source', value: '' }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'params'
    })

    const onSubmit = (data: FormData) => {

        const baseUrl = data.environment === 'prod'
            ? 'https://prod.example.com'
            : data.environment === 'stg'
                ? 'https://stg.example.com'
                : 'https://uat.example.com'

        const params = new URLSearchParams()
        // Add title and screen first
        data.title && params.append('title', data.title)
        data.screen && params.append('screen', data.screen)
        data.useCase && params.append('useCase', data.useCase)
        // Then add the dynamic parameters
        data.params.forEach(param => {
            if (param.key && param.value) {
                params.append(param.key, param.value)
            }
        })

        const url = `${baseUrl}/${data.campaignUrl}?${params.toString()}`
        setGeneratedUrl(url)
    }

    return (
        <div className="grid md:grid-cols-2 gap-6 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold">Deeplink | Onelink</h2>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Environment</Label>
                        <Controller
                            name="environment"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select environment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="uat">UAT</SelectItem>
                                        <SelectItem value="stg">Staging</SelectItem>
                                        <SelectItem value="prod">Production</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>QR Type</Label>
                        <Controller
                            name="qrType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select QR type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deeplink">Deep Link</SelectItem>
                                        <SelectItem value="onelink">One Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Campaign URL</Label>
                        <Input {...register('campaignUrl')} placeholder="https://example.com/" />
                    </div>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...register('title')} placeholder="Enter title" />
                    </div>

                    <div className="space-y-2">
                        <Label>Screen</Label>
                        <Controller
                            name="screen"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select screen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dop_native_introduction_screen">DOP Native | dop_native_introduction_screen</SelectItem>
                                        <SelectItem value="non_login_qr_code_scanner_screen">Scan QR non Login | non_login_qr_code_scanner_screen</SelectItem>
                                        <SelectItem value="qr_code_scanner_screen">Scan QR | qr_code_scanner_screen</SelectItem>
                                        <SelectItem value="login_screen">Login | login_screen</SelectItem>
                                        <SelectItem value="my_promotion_list_screen">My Promo Tab | my_promotion_list_screen</SelectItem>
                                        <SelectItem value="announcement_list_screen">Notifications | announcement_list_screen</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Parameters</Label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <Input
                                    {...register(`params.${index}.key`)}
                                    placeholder="Parameter"
                                    className="flex-1"
                                />
                                <Input
                                    {...register(`params.${index}.value`)}
                                    placeholder="Value"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ key: '', value: '' })}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Parameter
                        </Button>
                    </div>

                    <Button type="submit" className="w-full">
                        Generate QR Code
                    </Button>
                </div>
            </form>

            <Card className="p-6 space-y-6">
                {generatedUrl && (
                    <>
                        <div className="flex justify-center">
                            <QRCodeSVG value={generatedUrl} size={256} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Raw link:</Label>
                                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(generatedUrl)}>
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-3 bg-muted rounded-lg break-all text-sm">
                                {generatedUrl}
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}