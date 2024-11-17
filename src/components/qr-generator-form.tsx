
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
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Copy, Plus, Trash2 } from 'lucide-react'

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

export default function QRGeneratorForm() {
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

    return (
        <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
            <div>
                <h1 className="text-2xl font-bold mb-6">Deeplink | Onelink</h1>

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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select QR type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="deepLink">Deep Link</SelectItem>
                                            <SelectItem value="oneLink">One Link</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select use case" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="openCampaign">Open a Campaign with CTA to open an App Screen</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
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
                                        <Input placeholder="https://" {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select screen" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="dop_native_introduction_screen">DOP Native | dop_native_introduction_screen</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Parameters</h3>
                                <Button type="button" variant="outline" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Manual
                                </Button>
                            </div>

                            {form.watch('params').map((_, index) => (
                                <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`params.${index}.key`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`params.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button type="submit" className="w-full">Generate QR Code</Button>
                    </form>
                </Form>
            </div>

            <div className="space-y-6">
                <Card className="p-6">
                    <div className="aspect-square relative mb-4">
                        <img
                            src="/placeholder.svg"
                            alt="Generated QR Code"
                            // fill
                            className="object-contain"
                        />
                    </div>
                    <Button className="w-full" variant="secondary">
                        CTA for Deeplink/Onelink
                    </Button>
                </Card>

                <div>
                    <h3 className="font-medium mb-2">Raw link:</h3>
                    <div className="relative">
                        <Input
                            readOnly
                            value="evoappvn://mobile/deeplinking?screen_name=webview&web_link=https%3A%2F%2Fwww.goevo.vn"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}