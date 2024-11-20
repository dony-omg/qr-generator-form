'use client'

import { useState } from 'react'
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


export default function Component() {
    const [formData, setFormData] = useState({
        environment: 'uat',
        qrType: 'deeplink',
        useCase: 'campaign',
        campaignUrl: '',
        title: '',
        screen: 'dop_native_introduction_screen',
        params: [{ key: 'utm_source', value: '' }]
    })

    const [generatedUrl, setGeneratedUrl] = useState('')

    const handleParamChange = (index: number, field: 'key' | 'value', value: string) => {
        const newParams = [...formData.params]
        newParams[index][field] = value
        setFormData({ ...formData, params: newParams })
    }

    const addParam = () => {
        setFormData({
            ...formData,
            params: [...formData.params, { key: '', value: '' }]
        })
    }

    const removeParam = (index: number) => {
        const newParams = formData.params.filter((_, i) => i !== index)
        setFormData({ ...formData, params: newParams })
    }

    const generateQRCode = () => {
        // In a real application, you would construct the URL based on the environment and parameters
        const baseUrl = formData.environment === 'prod'
            ? 'https://prod.example.com'
            : formData.environment === 'stg'
                ? 'https://stg.example.com'
                : 'https://uat.example.com'

        const params = new URLSearchParams()
        formData.params.forEach(param => {
            if (param.key && param.value) {
                params.append(param.key, param.value)
            }
        })

        const url = `${baseUrl}/${formData.campaignUrl}?${params.toString()}`
        setGeneratedUrl(url)
    }

    return (
        <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Deeplink | Onelink</h2>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Environment</Label>
                        <Select
                            value={formData.environment}
                            onValueChange={(value) => setFormData({ ...formData, environment: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select environment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uat">UAT</SelectItem>
                                <SelectItem value="stg">Staging</SelectItem>
                                <SelectItem value="prod">Production</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>QR Type</Label>
                        <Select
                            value={formData.qrType}
                            onValueChange={(value) => setFormData({ ...formData, qrType: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select QR type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="deeplink">Deep Link</SelectItem>
                                <SelectItem value="onelink">One Link</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Campaign URL</Label>
                        <Input
                            value={formData.campaignUrl}
                            onChange={(e) => setFormData({ ...formData, campaignUrl: e.target.value })}
                            placeholder="https://example.com/"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Screen</Label>
                        <Select
                            value={formData.screen}
                            onValueChange={(value) => setFormData({ ...formData, screen: value })}
                        >
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
                    </div>

                    <div className="space-y-4">
                        <Label>Parameters</Label>
                        {formData.params.map((param, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={param.key}
                                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                                    placeholder="Parameter"
                                    className="flex-1"
                                />
                                <Input
                                    value={param.value}
                                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="flex-1"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeParam(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={addParam}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Parameter
                        </Button>
                    </div>

                    <Button
                        onClick={generateQRCode}
                        className="w-full"
                    >
                        Generate QR Code
                    </Button>
                </div>
            </div>

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