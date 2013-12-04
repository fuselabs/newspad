/* Newspad ver. 1
Copyright (c) Microsoft Corporation
All rights reserved. 
Licensed under the Apache License, Version 2.0 (the ""License""); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT. 
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
*/

d = document;
p=/^http:/.test(d.location)?'http':'https';

nl = d.getElementById("newspad_article")
var iframe = d.createElement('iframe');       
nl.parentNode.insertBefore(iframe, nl);

iframe.src = "http://newspad.at/" + nl.getAttribute("data-article-id") + "/read";
iframe.width = nl.getAttribute("data-width");
iframe.height = nl.getAttribute("data-height");
nl.parentNode.removeChild(nl);
