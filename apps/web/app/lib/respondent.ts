import { client } from "./hc"

export const handleDeleteRespondent = async (resondentIds: string[]) => {
    const res = await client.api.respondent.multiple.$put({ json: resondentIds })
    if (!res.ok) throw new Error("failed to delete respondents")
    const json = await res.json()
    return json.respondents
}