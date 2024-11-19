
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Copy, ChevronDown, Trash2 } from 'lucide-react'
import { useState } from 'react'

const formSchema = z.object({
    qrType: z.string(),
    useCase: z.string(),
    campaignUrl: z.string().url(),
    title: z.string().min(2),
    screen: z.string(),
    params: z.array(z.object({
        key: z.string(),
        value: z.string()
    }))
})

export default function Component() {
    const [rawLink, setRawLink] = useState('evoappvn://mobile/deeplinking?screen_name=webview&web_link=https%3A%2F%2Fwww.goevo.vn&next_action_type=open_app_screen&next_action_screen_name=dop_native_introduction_screen&utm_campaign=767_vu_tran&utm_source=888&next_action_label=888')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            qrType: 'deepLink',
            useCase: 'openCampaign',
            campaignUrl: 'https://www.goevo.vn/',
            title: 'EVO QA Tool',
            screen: 'dop_native_introduction_screen',
            params: [
                { key: 'utm_source', value: 'hhm' },
                { key: 'utm_campaign', value: 'offline_24' }
            ]
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    const addParam = () => {
        const currentParams = form.getValues('params')
        form.setValue('params', [...currentParams, { key: '', value: '' }])
    }

    const removeParam = (index: number) => {
        const currentParams = form.getValues('params')
        form.setValue('params', currentParams.filter((_, i) => i !== index))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Deeplink | Onelink</CardTitle>
                <CardDescription>Generated QR Code</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="qrType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>QR Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#F4F1FF]">
                                                        <SelectValue placeholder="Select QR type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="deepLink">Deep Link</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="useCase"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Use Cases</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#F4F1FF]">
                                                        <SelectValue placeholder="Select use case" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="openCampaign">
                                                        Open a Campaign with CTA to open an App Screen
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="campaignUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Campaign URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://" {...field} className="bg-white" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-white" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="screen"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Screen</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#F4F1FF]">
                                                        <SelectValue placeholder="Select screen" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="dop_native_introduction_screen">
                                                        DOP Native | dop_native_introduction_screen
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4">
                                    <div className="flex flex-col space-y-2">
                                        {form.watch('params').map((param, index) => (
                                            <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2">
                                                <Select
                                                    value={param.key}
                                                    onValueChange={(value) => {
                                                        const params = form.getValues('params')
                                                        params[index].key = value
                                                        form.setValue('params', params)
                                                    }}
                                                >
                                                    <SelectTrigger className="bg-[#F4F1FF]">
                                                        <SelectValue placeholder="Select param" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="utm_source">utm_source</SelectItem>
                                                        <SelectItem value="utm_campaign">utm_campaign</SelectItem>
                                                        <SelectItem value="utm_storeid">utm_storeid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    value={param.value}
                                                    onChange={(e) => {
                                                        const params = form.getValues('params')
                                                        params[index].value = e.target.value
                                                        form.setValue('params', params)
                                                    }}
                                                    className="bg-white"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeParam(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full bg-white"
                                        onClick={addParam}
                                    >
                                        + ADD MANUAL
                                    </Button>
                                </div>

                                <Button type="submit" className="w-full bg-[#E67F45] hover:bg-[#E67F45]/90">
                                    Generate QR Code
                                </Button>
                            </form>
                        </Form>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="aspect-square relative mb-4 bg-white">
                                <img
                                    src="/placeholder.svg"
                                    alt="Generated QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <Button className="w-full bg-[#E67F45] hover:bg-[#E67F45]/90">
                                CTA for Deeplink/Onelink
                            </Button>
                        </Card>

                        <div>
                            <h3 className="font-medium mb-2">Raw link:</h3>
                            <div className="relative">
                                <Input
                                    readOnly
                                    value={rawLink}
                                    className="pr-10 bg-white"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => navigator.clipboard.writeText(rawLink)}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}