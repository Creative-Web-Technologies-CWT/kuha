from typing import Any

import openai
from azure.search.documents.aio import SearchClient
from azure.search.documents.models import QueryType

from approaches.approach import AskApproach
from core.messagebuilder import MessageBuilder
from text import nonewlines


class RetrieveThenReadApproach(AskApproach):
    """
    Simple retrieve-then-read implementation, using the Cognitive Search and OpenAI APIs directly. It first retrieves
    top documents from search, then constructs a prompt with them, and then uses OpenAI to generate an completion
    (answer) with that prompt.
    """

    system_chat_template = (
        "You are an intelligent assistant helping PAGERO GROUP stakeholders with their questions on e-invoicing and trade documents in country compliance reports. "
        + "Use 'you' to refer to the individual asking the questions even if they ask with 'I'. "
        + "Answer the following question using only the data provided in the sources below. "
        + "For tabular information return it as an html table. Do not return markdown format. "
        + "Each source has a name followed by colon and the actual information, always include the source name for each fact you use in the response. "
        + "If you cannot answer using the sources below, say you don't know. Use below example to answer"
    )

    # shots/sample conversation
#     question = """
# 'What is the deductible for the employee plan for a visit to Overlake in Bellevue?'

# Sources:
# info1.txt: deductibles depend on whether you are in-network or out-of-network. In-network deductibles are $500 for employee and $1000 for family. Out-of-network deductibles are $1000 for employee and $2000 for family.
# info2.pdf: Overlake is in-network for the employee plan.
# info3.pdf: Overlake is the name of the area that includes a park and ride near Bellevue.
# info4.pdf: In-network institutions include Overlake, Swedish and others in the region
# """
#     answer = "In-network deductibles are $500 for employee and $1000 for family [info1.txt] and Overlake is in-network for the employee plan [info2.pdf][info4.pdf]."

    question = """
'What e-invoicing regulations and standards are enforced by Croatia for compliance in international trade?'

Sources:
CCR Greece-3.pdf: The main purpose of this country compliance report is to provide the reader with an in- depth analysis of the focus country’s laws, regulations, and process with regards to e- invoicing and other trade documents. The analysis considers topics such as business requirements before switching to electronic invoices, e-document creation, e-document distribution, integrity and authenticity, and, finally, e-archiving. This document guides how Pagero solutions support customers in the focus country to meet local regulations and serves as a supplement to Pagero General E-invoicing Process Description. The information provided by Deloitte which is part of this material was solely prepared as general information. It was prepared to meet with specific requirements and was not prepared for any other purposes or objectives. Changes in conditions over time may affect the contents of the material and its content. We do not express any opinion or conclusion in this material. © 2018 4 | Pagero Group | Country Compliance Report: Greece 1. 
CCR Colombia-5.pdf: The Software PIN</td></tr></table> 6 | Pagero Group | Country Compliance Report: Colombia Gothenburg, 28 July 2023 <table><tr><td></td><td>is assigned either to a technical provider (PT) or the taxpayer, who is integrated with the DIAN directly</td></tr><tr><td>Technical Control Key</td><td>Each invoice must include the Technical Control Key (es. Clave Tecnica de Control). The Technical Control Key is used to generate CUFE on such DTE’s</td></tr><tr><td>UVT</td><td>This means Tax Value Unit (es. Unidad de Valor Tributario). Instead of setting a range in Colombian pesos, DIAN has a UVT value that is updated at least every year</td></tr></table> 7 | Pagero Group | Country Compliance Report: Colombia 2. General overview This section provides an initial introduction into the local e-Invoicing environment within Colombia, including the types of local e-invoice regulations, go-to governmental and industry bodies, and whether multiple invoicing regimes, that is, varying regulatory requirements, exist for example by industry, business size, or other defining factors. <table><tr><th>Item</th><th colSpan=2>Commentary</th></tr><tr><td rowSpan=2>Authorities and other agencies relevant for.
CCR Croatia-26.pdf: 0 and can accept through both AS2 and AS4 but right now because transitional period in PEPPOL infrastructure they have decided to enable only AS2 until April 2019. Status on the implementation of the Directive As for now, in Croatia, the Law on electronic Issuance of Public Procurement Invoices has been adopted and all public authorities are obliged to receive structured e-invoices according to the EN 16931 and accept and process such invoices beginning from December 1st, 2018. From July 1st, 2019, suppliers to contracting authorities are obliged to issue structured e- invoices. Registering Public Authorities (PA’s) into the Croatian SMP/SML will begin before the end of 2018. The majority of Croatian PA are connected to the Peppol eDelivery Network according to FINA. Businesses can be search using the Croatian Public service directory (https://servisi.fina.hr/e-racun-javna-trazilica/). The Croatian ISO6523 codes used in Peppol BIS is 9934 27 | Pagero Group | Country Compliance Report: Croatia Gothenburg, 14 February 2023 One can choose "Obveznik JN" for public authorities and "OIB" (Croatian Business Entity VAT number) or Business Entity name.
CCR Croatia-26.pdf: Group | Country Compliance Report: Croatia Gothenburg, 14 February 2023 One can choose "Obveznik JN" for public authorities and "OIB" (Croatian Business Entity VAT number) or Business Entity name "Naziv poslovnog subjekta" B2B eInvoicing capability FINA owns two platforms one for business and one for public authorities. In business segment they will only accept UBL 2.1 according to PEPPOL BIS 3.0. There is currently no talk surrounding enforcing mandatory B2B eInvoicing. 10.2. Additional requirements In line with EU Directive 2018/22, Croatia has implemented a mandatory disclosure rule, particularly in regard to Cross-Border arrangements, which now must be reported to the Croatian tax authority. In this case, either the taxpayer or the individuals who designed the original Cross-Border arrangement (i.e. tax advisors) are responsible for disclosing the information. QR code / supporting documentation 1 April 2020 – obligation to issue invoices for supporting documents (bids, orders, etc.) issued at the moment prior to issuing the fiscalized invoice. Fiscalization8 of these
"""
    answer = "Croatia enforces the use of structured e-invoices for compliance in international trade, which means that the invoices must follow a specific format and contain specific information. Specifically, the EN 16931 standard is required for public procurement invoices, which includes requirements for the content, format, and exchange of electronic invoices. Additionally, for B2B e-invoicing, Croatia requires the use of UBL 2.1 according to PEPPOL BIS 3.0, which also includes requirements for the content and format of electronic invoices. These invoices must be registered into the Croatian SMP/SML, which is the system used to manage and exchange information about Peppol participants in Croatia. Finally, the invoices must be created in compliance with the Croatian ISO6523 codes for Peppol BIS, which are specific codes used to identify participants in the Peppol network. Overall, these regulations and standards aim to ensure that e-invoices used in international trade in Croatia are structured, standardized, and compliant with local requirements.[CCR Croatia-26.pdf]"

    def __init__(
        self,
        search_client: SearchClient,
        openai_host: str,
        chatgpt_deployment: str,
        chatgpt_model: str,
        embedding_deployment: str,
        embedding_model: str,
        sourcepage_field: str,
        content_field: str,
    ):
        self.search_client = search_client
        self.openai_host = openai_host
        self.chatgpt_deployment = chatgpt_deployment
        self.chatgpt_model = chatgpt_model
        self.embedding_model = embedding_model
        self.embedding_deployment = embedding_deployment
        self.sourcepage_field = sourcepage_field
        self.content_field = content_field

    async def run(self, q: str, overrides: dict[str, Any]) -> dict[str, Any]:
        has_text = overrides.get("retrieval_mode") in ["text", "hybrid", None]
        has_vector = overrides.get("retrieval_mode") in ["vectors", "hybrid", None]
        use_semantic_captions = True if overrides.get("semantic_captions") and has_text else False
        top = overrides.get("top") or 3
        exclude_category = overrides.get("exclude_category") or None
        filter = "category ne '{}'".format(exclude_category.replace("'", "''")) if exclude_category else None

        # If retrieval mode includes vectors, compute an embedding for the query
        if has_vector:
            embedding_args = {"deployment_id": self.embedding_deployment} if self.openai_host == "azure" else {}
            embedding = await openai.Embedding.acreate(**embedding_args, model=self.embedding_model, input=q)
            query_vector = embedding["data"][0]["embedding"]
        else:
            query_vector = None

        # Only keep the text query if the retrieval mode uses text, otherwise drop it
        query_text = q if has_text else ""

        # Use semantic ranker if requested and if retrieval mode is text or hybrid (vectors + text)
        if overrides.get("semantic_ranker") and has_text:
            r = await self.search_client.search(
                query_text,
                filter=filter,
                query_type=QueryType.SEMANTIC,
                query_language="en-us",
                query_speller="lexicon",
                semantic_configuration_name="default",
                top=top,
                query_caption="extractive|highlight-false" if use_semantic_captions else None,
                vector=query_vector,
                top_k=50 if query_vector else None,
                vector_fields="embedding" if query_vector else None,
            )
        else:
            r = await self.search_client.search(
                query_text,
                filter=filter,
                top=top,
                vector=query_vector,
                top_k=50 if query_vector else None,
                vector_fields="embedding" if query_vector else None,
            )
        if use_semantic_captions:
            results = [
                doc[self.sourcepage_field] + ": " + nonewlines(" . ".join([c.text for c in doc["@search.captions"]]))
                async for doc in r
            ]
        else:
            results = [doc[self.sourcepage_field] + ": " + nonewlines(doc[self.content_field]) async for doc in r]
        content = "\n".join(results)

        message_builder = MessageBuilder(
            overrides.get("prompt_template") or self.system_chat_template, self.chatgpt_model
        )

        # add user question
        user_content = q + "\n" + f"Sources:\n {content}"
        message_builder.append_message("user", user_content)

        # Add shots/samples. This helps model to mimic response and make sure they match rules laid out in system message.
        message_builder.append_message("assistant", self.answer)
        message_builder.append_message("user", self.question)

        messages = message_builder.messages
        chatgpt_args = {"deployment_id": self.chatgpt_deployment} if self.openai_host == "azure" else {}
        chat_completion = await openai.ChatCompletion.acreate(
            **chatgpt_args,
            model=self.chatgpt_model,
            messages=messages,
            temperature=overrides.get("temperature") or 0.3,
            max_tokens=1024,
            n=1,
        )

        return {
            "data_points": results,
            "answer": chat_completion.choices[0].message.content,
            "thoughts": f"Question:<br>{query_text}<br><br>Prompt:<br>"
            + "\n\n".join([str(message) for message in messages]),
        }
