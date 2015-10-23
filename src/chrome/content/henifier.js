+(function() {

	window.addEventListener('load', windowLoadHandler);
		
    function windowLoadHandler()
    {
		window.removeEventListener('load', windowLoadHandler);
		document.getElementById('appcontent').addEventListener('DOMContentLoaded', DOMContentLoadedHandler);
    }
	
	function DOMContentLoadedHandler(content)
	{
		//pk = politiskt korrekt
		var pkTitle = turnTextPK(content.originalTarget.title);
		content.originalTarget.title = pkTitle;
		
		transformAllSubNodes(content.originalTarget.body);
	}
	
    function transformAllSubNodes(node)
    {
        // I stole this function from here (and edited it a bit):
        // http://is.gd/mwZp7E
    
        var child, next;
    
        switch ( node.nodeType )  
        {
            case 1:  // Element
            case 9:  // Document
            case 11: // Document fragment
                child = node.firstChild;
                while ( child ) 
                {
                    next = child.nextSibling;
                    transformAllSubNodes(child);
                    child = next;
                }
                break;
            case 3: // Text node
                transformNode(node);
                break;
			default:
				break;
        }
    }

    }());
    
	function transformNode(node)
	{
		node.nodeValue = turnTextPK(node.nodeValue);
	}
	
    function turnTextPK(text)
    {	
		var enableMarked = getBoolPref("extensions.henifier.partner", false);
		var enablePartner = getBoolPref("extensions.henifier.partner", false);
		
		var pkText = changeToHen(text, enableMarked);
		
		if(enablePartner)
		{
			pkText = changeToPartner(pkText, enableMarked);
		}
		
		return pkText;	
    }
	 
    function changeToHen(textToEdit, mark)
    {
        if (mark)
        {			
			textToEdit = textToEdit.replace(/\bh(a|o)n\b|\bhonom\b|\bhenne\b/g, "hen*");
			textToEdit = textToEdit.replace(/\bH(a|o)n\b|\bHonom\b|\bHenne\b/g, "Hen*");
            textToEdit = textToEdit.replace(/\bh(an|enne)s\b|\btjejs\b|\bkilles\b/g, "hens*");
            textToEdit = textToEdit.replace(/\bH(an|enne)s\b|\bTjejs\b|\bKilles\b/g, "Hens*");
        }    
        else
        {
            textToEdit = textToEdit.replace(/\bh(a|o)n\b|\bhonom\b|\bhenne\b/g, "hen");
            textToEdit = textToEdit.replace(/\bH(a|o)n\b|\bHonom\b|\bHenne\b/g, "Hen");
            textToEdit = textToEdit.replace(/\bh(an|enne)s\b|\btjejs\b|\bkilles\b/g, "hens");
            textToEdit = textToEdit.replace(/\bH(an|enne)s\b|\bTjejs\b|\bKilles\b/g, "Hens");
        }
        
        return textToEdit;
    }
	
	function changeToPartner(textToEdit, mark)
    {
        if (mark)
        {
            textToEdit = textToEdit.replace(/\b(flick|pojk)vän\b/g, "partner*");
            textToEdit = textToEdit.replace(/\b(Flick|Pojk)vän\b/g, "Partner*");
            
            textToEdit = textToEdit.replace(/\bmin\s(kille|tjej)\b/g, "min partner*");
            textToEdit = textToEdit.replace(/\bMin\s(kille|tjej)\b/g, "Min partner*");
        }
        else
        {
            textToEdit = textToEdit.replace(/\b(flick|pojk)vän\b/g, "partner");
            textToEdit = textToEdit.replace(/\b(Flick|Pojk)vän\b/g, "Partner");
            
            textToEdit = textToEdit.replace(/\bmin\s(kille|tjej)\b/g, "min partner");
            textToEdit = textToEdit.replace(/\bMin\s(kille|tjej)\b/g, "Min partner");
        }
        
        return textToEdit;
    }
	
	function getBoolPref(preferenceName, defaultValue)
	{
		try
		{
			var prefManager = getPrefManager();				 
			return prefManager.getBoolPref(preferenceName);
		}
		catch(markedPrefFetchingError)
		{
			console.log(markedPrefFetchingError);
			return defaultValue;
		}
	}
	
	function getPrefManager()
	{
		return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	}
