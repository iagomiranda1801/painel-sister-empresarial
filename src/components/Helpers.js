import {
  parseISO,
  format,
} from 'date-fns';
import { validate as validateCPF } from "gerador-validador-cpf";
import { cnpj } from "cpf-cnpj-validator";
import axios from "axios";

export const formatDateTime = ({ data, time = false, formatDefault = "dd/MM/yyyy HH:mm:ss" }) => {

  if (data === undefined) {
    return null;
  }
  const date = parseISO(data);

  if (time) {
    return format(date, formatDefault);
  } else {
    return format(date, "dd/MM/yyyy");
  }

};

export const FormatAmountBrazil = (val, pref = 'R$') => {
  return pref + parseFloat(val).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(",", "").replace(".", ",")
};

export async function validateCpf(document) {
  let response = {
    valid: false,
    message: "CPF inválido",
  };

  if (!document) return response;

  let valid = validateCPF(document);

  response.valid = valid;
  response.message = valid ? "CPF válido" : "CPF inválido";

  return response;
}

export async function validateCNPJ(document) {
  let response = {
    valid: false,
    message: "CNPJ inválido",
  };

  if (!document) return response;

  let valid = cnpj.isValid(document);

  response.valid = valid;
  response.message = valid ? "CNPJ válido" : "CNPJ inválido";

  return response;
}

export const maskPhone = (e) => {
  let value = e;

  value = value.replace(/\D/g, '');

  value = value.replace(/^(\d{2})(\d)/g, '($1)$2');
  value = value.replace(/(\d)(\d{4})$/, '$1-$2');

  return value
};

export const isEmail = (e) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(e);
};


export const isCnpfOrCpf = (e) => {
   // Remove caracteres não numéricos
  const cleanStr = e.replace(/\D/g, '');

  // Define as expressões regulares para CPF e CNPJ
  const cpfRegex = /^\d{11}$/; // CPF deve ter 11 dígitos
  const cnpjRegex = /^\d{14}$/; // CNPJ deve ter 14 dígitos

  // Verifica se é CPF ou CNPJ baseado no comprimento da string limpa
  if (cleanStr.length === 11 && cpfRegex.test(cleanStr)) {
    return 'CPF';
  } else if (cleanStr.length === 14 && cnpjRegex.test(cleanStr)) {
    return 'CNPJ';
  } else {
    return
  }
}

export const isPhone = (e) => {
  const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/; // Formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
  return regex.test(e);
}

// export const isName = (e) => {
// const regex = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]+$/;
// return regex.test(e);
// }

export const maskCpfOrCnpj = (e) => {
  let value = e;
  // Remove caracteres não numéricos
  value = value.replace(/\D/g, '');

  if (value.length <= 11) {
    // Máscara para CPF
    value = value.replace(/(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/, (regex, arg1, arg2, arg3, arg4) => {
      let r = `${arg1}`;
      if (arg2) r += `.${arg2}`;
      if (arg3) r += `.${arg3}`;
      if (arg4) r += `-${arg4}`;
      return r;
    });
  } else {
    // Máscara para CNPJ
    value = value.replace(/(\d{2})(\d{1,3})?(\d{1,3})?(\d{1,4})?(\d{1,2})?/, (regex, arg1, arg2, arg3, arg4, arg5) => {
      let r = `${arg1}`;
      if (arg2) r += `.${arg2}`;
      if (arg3) r += `.${arg3}`;
      if (arg4) r += `/${arg4}`;
      if (arg5) r += `-${arg5}`;
      return r;
    });
  }
  return value
}

export const handleMaskCep = (e) => {
  let value = e
  // Remove tudo o que não é dígito
  value = value.replace(/\D/g, '');

  // Aplica a máscara XXXXX-XXX
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');

  return value;
}

export const handleCep = async (cep) => {
  if (cep.length <= 8) return null;

  if (cep === "69825-000") {
    return {
      logradouro: "Rua da Green",
      bairro: "GS",
      localidade: "Green Signal",
      uf: "GS",
      latitude: "-19.924932",
      longitude: "-43.966362",
      error: false,
      message: "Endereço Ambiente Green",
    };
  }

  let CepData = await axios
    .get(`https://viacep.com.br/ws/${cep}/json/`)
    .then(async (result) => {
      result = result.data;
      if (!result.erro) {
        const address = `${result.logradouro} ${result.localidade} ${result.uf}`;
        let geolocation = await fetch(
          `https://us1.locationiq.com/v1/search.php?key=61d7b8f8e33bc0&q=${encodeURI(
            address
          )}&format=json`
        )
          .then((response) => response.json())
          .then((json) => {
            // Solução temporária AMVAP indianopolis
            if (cep === "69982-000") {
              return { latitude: "-19.036152", longitude: "-47.917679" };
            }
            // Solução temporária AMVAP araguari
            if (cep === "69927-000") {
              return { latitude: "-18.646096", longitude: "-48.186331" };
            }

            return { latitude: json[0].lat, longitude: json[0].lon };
          });
        result["latitude"] = geolocation.latitude;
        result["longitude"] = geolocation.longitude;
      }
      return result;
    })
    .catch((error) => {
      return { erro: true, message: error };
    });

  return CepData;
};

export function validatePassWord(pass, pass2compare, onlyNumbers = false) {
  let response = {
    valid: false,
    message: "",
  };

  // Only Numbers option
  if (onlyNumbers && (isNaN(pass) || isNaN(pass2compare))) {
    response.valid = false;
    response.message = "Senha inválida, digite apenas números";
    return response;
  }

  // Any password option
  if (pass2compare !== pass) {
    response.valid = false;
    response.message = "Senhas não conferem";
  } else {
    response.valid = true;
    response.message = "Senhas valídas";
  }
  return response;
}


export function formatMoney(value) {
  if (value === null) {
    return 0.00
  }
  if (typeof value === "string") {
    value = value.replace("R", "").replace("$", "").replace(",", ".");
  }

  let convertValue = parseFloat(value);

  let opt = {
    style: 'currency',
    currency: 'BRL'
  }

  return convertValue.toLocaleString('pt-BR', opt);
}
